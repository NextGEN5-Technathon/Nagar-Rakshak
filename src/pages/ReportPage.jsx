import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function ReportPage() {
  // Authentication State
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMsg, setAuthMsg] = useState('');

  // Form State
  const [category, setCategory] = useState('pothole');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if a user is already logged in when the page loads
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
  }, []);

  // Developer Auth Handlers
  const handleSignUp = async () => {
    setAuthMsg("Signing up...");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setAuthMsg(error.message);
    else setAuthMsg("Account created! (If it says check email, ask backend to turn off Email Confirmation in Supabase)");
  };

  const handleSignIn = async () => {
    setAuthMsg("Logging in...");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthMsg(error.message);
    else {
      setAuthMsg("Logged in successfully!");
      setUser(data.user);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Helper to get GPS coordinates
  const getGPSLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude.toFixed(5));
        setLongitude(position.coords.longitude.toFixed(5));
      });
    } else {
      alert("Geolocation not supported. Enter manually.");
    }
  };

  // Handle Image Selection & 5MB Limit Check
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Maximum size is 5MB.");
        e.target.value = null; // Clear the input
        setImageFile(null);
      } else {
        setImageFile(file);
      }
    }
  };

  // Submit the Hazard Report
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setStatusMsg("Error: You must log in first.");
    
    setIsSubmitting(true);
    let uploadedImagePath = null;

    // STEP 1: Upload the Image (if selected)
    if (imageFile) {
      setStatusMsg("Uploading image securely...");
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`; // Unique filename

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('report-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        setStatusMsg(`Image Upload Failed: ${uploadError.message}. Did your teammate create the bucket?`);
        setIsSubmitting(false);
        return; // Stop the entire submission if the image fails
      }
      
      uploadedImagePath = uploadData.path;
    }

    // STEP 2: Save the Database Record
    setStatusMsg("Saving report data...");
    const latFloat = parseFloat(latitude);
    const lngFloat = parseFloat(longitude);

    const newReport = {
      reporter_id: user.id,
      category: category,
      description: description,
      latitude: latFloat,
      longitude: lngFloat,
      public_latitude: parseFloat(latFloat.toFixed(2)),
      public_longitude: parseFloat(lngFloat.toFixed(2)),
      image_path: uploadedImagePath, // Attach the image path we just generated!
      status: 'pending'
    };

    const { error } = await supabase.from('reports').insert(newReport);

    if (error) {
      setStatusMsg("Database Error: " + error.message);
      console.error(error);
    } else {
      setStatusMsg("Success! Report and Image sent to Moderator queue.");
      setDescription('');
      setImageFile(null);
      // Reset file input visually
      document.getElementById('image-upload').value = ''; 
    }
    
    setIsSubmitting(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: 'white' }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Nagar-Rakshak Report</h1>

      {/* STEP 1: AUTHENTICATION PANEL */}
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>
          {user ? `Logged in as: ${user.email}` : '1. Authentication (Required)'}
        </h2>
 
        {!user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: 'none' }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: 'none' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSignIn} style={{ flex: 1, padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Login</button>
              <button onClick={handleSignUp} style={{ flex: 1, padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sign Up</button>
            </div>
            {authMsg && <p style={{ color: '#fbbf24', fontSize: '14px', marginTop: '10px' }}>{authMsg}</p>}
          </div>
        ) : (
          <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        )}
      </div>

      {/* STEP 2: REPORT FORM */}
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', opacity: user ? 1 : 0.5, pointerEvents: user ? 'auto' : 'none' }}>
        <h2 style={{ fontSize: '20px', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>2. Submit Hazard</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', backgroundColor: '#334155', color: 'white', border: '1px solid #475569' }}>
              <option value="pothole">Pothole</option>
              <option value="broken_streetlight">Broken Streetlight</option>
              <option value="damaged_footpath">Damaged Footpath</option>
              <option value="garbage">Garbage</option>
              <option value="blocked_pathway">Blocked Pathway</option>
              <option value="flooding">Flooding</option>
              <option value="unsafe_structure">Unsafe Structure</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required minLength={10} maxLength={500} style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '4px', backgroundColor: '#334155', color: 'white', border: '1px solid #475569' }} placeholder="Describe the hazard (min 10 chars)..." />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Exact Location</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input type="number" step="any" placeholder="Latitude" required value={latitude} onChange={e => setLatitude(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '4px', backgroundColor: '#334155', color: 'white', border: '1px solid #475569' }} />
              <input type="number" step="any" placeholder="Longitude" required value={longitude} onChange={e => setLongitude(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '4px', backgroundColor: '#334155', color: 'white', border: '1px solid #475569' }} />
            </div>
            <button type="button" onClick={getGPSLocation} style={{ width: '100%', padding: '10px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              📍 Auto-Detect My GPS Location
            </button>
          </div>

          {/* NEW: IMAGE UPLOAD FIELD */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Upload Image Proof (Max 5MB)</label>
            <input 
              type="file" 
              id="image-upload"
              accept="image/jpeg, image/png" 
              onChange={handleFileChange}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', backgroundColor: '#334155', color: 'white', border: '1px solid #475569' }} 
            />
          </div>

          <button disabled={isSubmitting} type="submit" style={{ width: '100%', padding: '15px', backgroundColor: isSubmitting ? '#94a3b8' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', marginTop: '10px' }}>
            {isSubmitting ? 'Processing...' : 'Submit Report'}
          </button>
        </form>
        
        {statusMsg && <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#334155', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold', color: statusMsg.includes('Failed') || statusMsg.includes('Error') ? '#f87171' : '#34d399' }}>{statusMsg}</div>}
      </div>
    </div>
  );
}

export default ReportPage;