import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import axios from "axios";

const MAX_URLS = 5;

function App() {
  const [urls, setUrls] = useState([{ longUrl: "", validity: "", shortCode: "" }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const addUrlField = () => {
    if (urls.length < MAX_URLS) {
      setUrls([...urls, { longUrl: "", validity: "", shortCode: "" }]);
    }
  };

  const validateInputs = () => {
    const urlRegex = /^(https?:\/\/)[\w.-]+(\.[\w\.-]+)+[/#?]?.*$/;
    for (let i = 0; i < urls.length; i++) {
      const { longUrl, validity, shortCode } = urls[i];
      if (!longUrl || !urlRegex.test(longUrl)) {
        return `Row ${i + 1}: Invalid URL format`;
      }
      if (validity && (!Number.isInteger(Number(validity)) || Number(validity) <= 0)) {
        return `Row ${i + 1}: Validity must be a positive integer`;
      }
      if (shortCode && !/^[a-zA-Z0-9]+$/.test(shortCode)) {
        return `Row ${i + 1}: Shortcode must be alphanumeric`;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/shorten/bulk", { urls });
      setResults(res.data); // expected: [{ originalUrl, shortUrl, expiryAt }]
    } catch (err) {
      setError("Failed to shorten URLs: " + err.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        URL Shortener
      </Typography>

      {urls.map((url, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Original Long URL"
              value={url.longUrl}
              onChange={(e) => handleChange(index, "longUrl", e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Validity (minutes)"
              value={url.validity}
              onChange={(e) => handleChange(index, "validity", e.target.value)}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Custom Shortcode"
              value={url.shortCode}
              onChange={(e) => handleChange(index, "shortCode", e.target.value)}
            />
          </Grid>
        </Grid>
      ))}

      {urls.length < MAX_URLS && (
        <Button variant="outlined" onClick={addUrlField} sx={{ mb: 2 }}>
          + Add Another URL
        </Button>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Shorten URLs
      </Button>

      {results.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <Grid container spacing={2}>
            {results.map((res, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Typography>
                      <strong>Original:</strong> {res.originalUrl}
                    </Typography>
                    <Typography>
                      <strong>Shortened:</strong>{" "}
                      <a href={res.shortUrl} target="_blank" rel="noreferrer">
                        {res.shortUrl}
                      </a>
                    </Typography>
                    <Typography>
                      <strong>Expiry:</strong> {new Date(res.expiryAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </Container>
  );
}

export default App;
