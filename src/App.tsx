import React, { useState } from 'react';

const App: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{ title?: string; description?: string } | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOriginalUrl(null);
    setFinalUrl(null);
    setMetadata(null);
    setWarnings([]);

    try {
      const resp = await fetch('http://localhost:4000/api/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Unknown error');
      setOriginalUrl(data.originalUrl);
      setFinalUrl(data.finalUrl);
      setMetadata(data.metadata);
      setWarnings(data.warnings || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <h1 style={styles.title}>Ad Link Bypass</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="url"
            aria-label="Paste your Ad Link here"
            placeholder="Paste your Ad Link here"
            required
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Bypassing...' : 'Bypass Link'}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        {finalUrl && (
          <section style={styles.results}>
            <h2 style={styles.resultTitle}>Results</h2>
            <div style={styles.urlBlock}>
              <label style={styles.label}>Original Link</label>
              <div style={styles.urlRow}>
                <a href={originalUrl!} target="_blank" rel="noopener noreferrer" style={styles.link}>
                  {originalUrl}
                </a>
                <button onClick={() => copyToClipboard(originalUrl!)} style={styles.copyButton}>
                  Copy Link
                </button>
              </div>
            </div>

            <div style={styles.urlBlock}>
              <label style={styles.label}>Bypassed Link</label>
              <div style={styles.urlRow}>
                <a href={finalUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                  {finalUrl}
                </a>
                <div>
                  <button
                    onClick={() => window.open(finalUrl, '_blank')}
                    style={{ ...styles.actionButton, marginRight: 8 }}
                  >
                    Open Link
                  </button>
                  <button onClick={() => copyToClipboard(finalUrl)} style={styles.copyButton}>
                    Copy Link
                  </button>
                </div>
              </div>
            </div>

            {metadata?.title && (
              <p style={styles.metaText}>
                <strong>Title:</strong> {metadata.title}
              </p>
            )}
            {metadata?.description && (
              <p style={styles.metaText}>
                <strong>Description:</strong> {metadata.description}
              </p>
            )}

            {warnings.length > 0 && (
              <div style={styles.warning}>
                <strong>Warnings:</strong>
                <ul>
                  {warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: '#000',
    color: '#fff',
    height: '100vh',
    margin: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    maxWidth: 600,
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 30,
    marginBottom: 24,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  input: {
    fontSize: 18,
    padding: '12px 16px',
    borderRadius: 6,
    border: '2px solid #fff',
    backgroundColor: '#000',
    color: '#fff',
    outline: 'none',
  },
  button: {
    backgroundColor: '#fff',
    color: '#000',
    fontWeight: '600',
    fontSize: 18,
    padding: '12px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  error: {
    marginTop: 16,
    color: 'tomato',
    fontWeight: '600',
  },
  results: {
    marginTop: 32,
    textAlign: 'left',
  },
  resultTitle: {
    borderBottom: '1px solid #555',
    paddingBottom: 6,
    marginBottom: 12,
  },
  urlBlock: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '700',
    marginBottom: 6,
  },
  urlRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  link: {
    color: '#0af',
    wordBreak: 'break-word',
    flex: 1,
  },
  copyButton: {
    backgroundColor: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    padding: '6px 10px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#fff',
    color: '#000',
    fontWeight: '600',
    borderRadius: 4,
    border: 'none',
    cursor: 'pointer',
    padding: '6px 14px',
    fontSize: 14,
  },
  metaText: {
    marginTop: 8,
    fontSize: 14,
    color: '#aaa',
  },
  warning: {
    color: 'orange',
    fontSize: 14,
    marginTop: 12,
  },
};

export default App;
