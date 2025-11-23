
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient' 
import './App.css'


function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {

  // ========== TEST SUPABASE CONNECTION HERE ==========
  async function testSupabase() {
    const { data, error } = await supabase.from("users").select("*");
    console.log("TEST DATA:", data);
    console.log("TEST ERROR:", error);
  }
  testSupabase();
  // ===================================================

  // Auth session listener
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session)
  })

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => setSession(session)
  )

  return () => subscription.unsubscribe()
}, [])


  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error) console.error('Error logging in with Google:', error.message)
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error logging out:', error.message)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Supabase + React Google Auth</h1>
        {session ? (
          <div>
            <h2>Welcome!</h2>
            <p>You are logged in as: <strong>{session.user.email}</strong></p>
            <img src={session.user.user_metadata.avatar_url} alt="User avatar" style={{ borderRadius: '50%', width: '100px' }} />
            <br />
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <p>Please log in to continue.</p>
            <button onClick={handleGoogleLogin}>Login with Google</button>
          </div>
        )}
      </header>
    </div>
  )
}

export default App
