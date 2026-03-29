import React, { useState } from 'react';
import { Box, TextField, Button, Link, Alert } from '@mui/material';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import { LoginService } from './LoginService';
import AclModel from '../../core/security/AclModel';
import './LoginPage.css';
import { useLoginVisibility } from './LoginVisibilityProvider';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { hideLoginPage } = useLoginVisibility();

  const handleLoginBtn = async () => {
    const response: AclModel = await LoginService.handleLogin(username, password);
    if (response.success) {
      hideLoginPage();
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="login-root">

      {/* LEFT PANEL — branding / decorative */}
      <div className="login-left">
        <div className="login-left__content">

          <div className="login-left__icon-wrap">
            <LocalHospitalRoundedIcon sx={{ fontSize: 36, color: '#ffffff' }} />
          </div>

          <h1 className="login-left__tagline">
            Dc Assad clinic,<br />
            <span>always connected.</span>
          </h1>

          <p className="login-left__sub">
            Secure access to patient records, appointments,
            and your full healthcare dashboard — all in one place.
          </p>

          <div className="login-left__features">
            <div className="login-left__feature">
              <span className="login-left__feature-dot" />
              Real-time patient management
            </div>
            <div className="login-left__feature">
              <span className="login-left__feature-dot" />
              Appointment scheduling & reminders
            </div>
            <div className="login-left__feature">
              <span className="login-left__feature-dot" />
              Encrypted & HIPAA-compliant records
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="login-right">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          width={{ xs: '100%', sm: 320 }}
        >
          {/* Small logo mark above form */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mb={1}
            sx={{ color: 'var(--clinic-navy)' }}
          >
            <LocalHospitalRoundedIcon sx={{ fontSize: 28, color: 'var(--clinic-sage)' }} />
            <Box
              component="span"
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                color: 'var(--clinic-navy)',
                letterSpacing: '-0.2px',
              }}
            >
              Staff Portal
            </Box>
          </Box>

          <Box
            component="p"
            sx={{
              m: 0,
              mb: 1,
              fontSize: '0.875rem',
              color: 'var(--clinic-text-muted)',
              textAlign: 'center',
            }}
          >
            Sign in to your account
          </Box>

          {/* Error alert — only shown when error is set */}
          {error && (
            <Alert
              severity="error"
              onClose={() => setError('')}
              sx={{ width: '100%' }}
            >
              {error}
            </Alert>
          )}

          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleLoginBtn}
            disableElevation
          >
            Login
          </Button>

          <Link component="button" onClick={() => {}}>
            Forgot password?
          </Link>
        </Box>
      </div>

    </div>
  );
}