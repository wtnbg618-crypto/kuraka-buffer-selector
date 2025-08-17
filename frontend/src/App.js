
import React, { useState } from 'react';
import './App.css';
import horizontalCollision from './horizontal_collision.png';
import verticalCollision from './vertical_collision.png';
import horizontalRelativeCollision from './horizontal_relative_collision.png';
import slopeCollision from './slope_collision.png';

function App() {
  const [bufferType, setBufferType] = useState('KUB');
  const [mass, setMass] = useState(350);
  const [velocity, setVelocity] = useState(0.5);
  const [force, setForce] = useState(0);
  const [numBuffersN1, setNumBuffersN1] = useState(2);
  const [numBuffersN2, setNumBuffersN2] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // New state for collision pattern and its specific inputs
  const [collisionPattern, setCollisionPattern] = useState('horizontal');
  const [dropHeight, setDropHeight] = useState(1);
  const [massA, setMassA] = useState(100);
  const [massB, setMassB] = useState(100);
  const [velocityA, setVelocityA] = useState(0.5);
  const [velocityB, setVelocityB] = useState(0.5);
  const [forceA, setForceA] = useState(0);
  const [forceB, setForceB] = useState(0);
  const [slopeLength, setSlopeLength] = useState(10);
  const [slopeAngle, setSlopeAngle] = useState(30);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const selectionInput = {
      buffer_type: bufferType,
      num_buffers_N1: parseInt(numBuffersN1),
      num_buffers_N2: parseInt(numBuffersN2),
      collision_pattern: collisionPattern,
    };

    if (collisionPattern === 'horizontal' || collisionPattern === 'slope' || collisionPattern === 'vertical') {
        selectionInput.mass = parseFloat(mass);
    }

    if (collisionPattern === 'horizontal') {
      selectionInput.velocity = parseFloat(velocity);
      selectionInput.force = parseFloat(force);
    } else if (collisionPattern === 'vertical') {
      selectionInput.drop_height = parseFloat(dropHeight);
    } else if (collisionPattern === 'horizontal-relative') {
      selectionInput.mass_A = parseFloat(massA);
      selectionInput.mass_B = parseFloat(massB);
      selectionInput.velocity_A = parseFloat(velocityA);
      selectionInput.velocity_B = parseFloat(velocityB);
      selectionInput.force_A = parseFloat(forceA);
      selectionInput.force_B = parseFloat(forceB);
    } else if (collisionPattern === 'slope') {
      selectionInput.velocity = parseFloat(velocity);
      selectionInput.force = parseFloat(force);
      selectionInput.slope_length = parseFloat(slopeLength);
      selectionInput.slope_angle = parseFloat(slopeAngle);
    }

    try {
      const response = await fetch('http://localhost:8000/select_buffer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectionInput),
      });

      if (!response.ok) {
        throw new Error('サーバーからの応答がありません');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>倉敷化工 衝撃緩衝器 選定ツール</h1>
      </header>
      <main>
        <div className="main-container">
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>衝突パターン:</label>
                <select value={collisionPattern} onChange={(e) => setCollisionPattern(e.target.value)}>
                  <option value="horizontal">水平衝突</option>
                  <option value="vertical">垂直衝突</option>
                  <option value="horizontal-relative">水平相対衝突</option>
                  <option value="slope">斜面衝突</option>
                </select>
              </div>
              <div className="form-group">
                <label>緩衝器タイプ:</label>
                <select value={bufferType} onChange={(e) => setBufferType(e.target.value)}>
                  <option value="KUB">KUB (発泡ウレタン)</option>
                  <option value="KRB">KRB (ゴム)</option>
                </select>
              </div>

              {collisionPattern === 'horizontal' && (
                <>
                  <div className="form-group">
                    <label>質量 (m):</label>
                    <input type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="例: 350 (ton)" />
                    <span> ton</span>
                  </div>
                  <div className="form-group">
                    <label>速度 (v):</label>
                    <input type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} placeholder="例: 0.5 (m/s)" />
                    <span> m/s</span>
                  </div>
                  <div className="form-group">
                    <label>推進力 (F):</label>
                    <input type="number" value={force} onChange={(e) => setForce(e.target.value)} placeholder="例: 0 (N)" />
                    <span> N</span>
                  </div>
                </>
              )}

              {collisionPattern === 'vertical' && (
                <>
                  <div className="form-group">
                    <label>質量 (m):</label>
                    <input type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="例: 350 (ton)" />
                    <span> ton</span>
                  </div>
                  <div className="form-group">
                    <label>落下高さ (H):</label>
                    <input type="number" value={dropHeight} onChange={(e) => setDropHeight(e.target.value)} placeholder="例: 1 (m)" />
                    <span> m</span>
                  </div>
                </>
              )}

              {collisionPattern === 'horizontal-relative' && (
                <>
                  <div className="form-group">
                    <label>質量 (mA):</label>
                    <input type="number" value={massA} onChange={(e) => setMassA(e.target.value)} placeholder="例: 100 (ton)" />
                    <span> ton</span>
                  </div>
                  <div className="form-group">
                    <label>質量 (mB):</label>
                    <input type="number" value={massB} onChange={(e) => setMassB(e.target.value)} placeholder="例: 100 (ton)" />
                    <span> ton</span>
                  </div>
                  <div className="form-group">
                    <label>速度 (vA):</label>
                    <input type="number" value={velocityA} onChange={(e) => setVelocityA(e.target.value)} placeholder="例: 0.5 (m/s)" />
                    <span> m/s</span>
                  </div>
                  <div className="form-group">
                    <label>速度 (vB):</label>
                    <input type="number" value={velocityB} onChange={(e) => setVelocityB(e.target.value)} placeholder="例: 0.5 (m/s)" />
                    <span> m/s</span>
                  </div>
                  <div className="form-group">
                    <label>推進力 (FA):</label>
                    <input type="number" value={forceA} onChange={(e) => setForceA(e.target.value)} placeholder="例: 0 (N)" />
                    <span> N</span>
                  </div>
                  <div className="form-group">
                    <label>推進力 (FB):</label>
                    <input type="number" value={forceB} onChange={(e) => setForceB(e.target.value)} placeholder="例: 0 (N)" />
                    <span> N</span>
                  </div>
                </>
              )}

              {collisionPattern === 'slope' && (
                <>
                  <div className="form-group">
                    <label>質量 (m):</label>
                    <input type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="例: 350 (ton)" />
                    <span> ton</span>
                  </div>
                  <div className="form-group">
                    <label>速度 (v):</label>
                    <input type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} placeholder="例: 0.5 (m/s)" />
                    <span> m/s</span>
                  </div>
                  <div className="form-group">
                    <label>傾斜長 (L):</label>
                    <input type="number" value={slopeLength} onChange={(e) => setSlopeLength(e.target.value)} placeholder="例: 10 (m)" />
                    <span> m</span>
                  </div>
                  <div className="form-group">
                    <label>傾斜角 (θ):</label>
                    <input type="number" value={slopeAngle} onChange={(e) => setSlopeAngle(e.target.value)} placeholder="例: 30 (度)" />
                    <span> 度</span>
                  </div>
                  <div className="form-group">
                    <label>推進力 (F):</label>
                    <input type="number" value={force} onChange={(e) => setForce(e.target.value)} placeholder="例: 0 (N)" />
                    <span> N</span>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>緩衝点の数 (N1):</label>
                <input type="number" value={numBuffersN1} onChange={(e) => setNumBuffersN1(e.target.value)} placeholder="例: 2" />
              </div>
              <div className="form-group">
                <label>取付方法 (N2):</label>
                <input type="number" value={numBuffersN2} onChange={(e) => setNumBuffersN2(e.target.value)} placeholder="片側: 1, 両側: 2" />
                <span> (片側=1, 両側=2)</span>
              </div>
              <button type="submit">選定</button>
            </form>
          </div>
          <div className="glossary-container">
            <div className="glossary">
                <h2>用語解説</h2>
                {collisionPattern === 'horizontal' && (
                  <div className="glossary-item">
                      <h3>質量 (m), 速度 (v), 推進力 (F)</h3>
                      <p>各項目が衝突のどの部分を指すかは、下の「水平衝突」の図をご覧ください。</p>
                      <img src={horizontalCollision} alt="水平衝突のイラスト"/>
                  </div>
                )}
                {collisionPattern === 'vertical' && (
                  <div className="glossary-item">
                      <h3>質量 (m), 落下高さ (H)</h3>
                      <p>各項目が衝突のどの部分を指すかは、下の「垂直衝突」の図をご覧ください。</p>
                      <img src={verticalCollision} alt="垂直衝突のイラスト"/>
                  </div>
                )}
                {collisionPattern === 'horizontal-relative' && (
                  <div className="glossary-item">
                      <h3>質量 (mA, mB), 速度 (vA, vB), 推進力 (FA, FB)</h3>
                      <p>各項目が衝突のどの部分を指すかは、下の「水平相対衝突」の図をご覧ください。</p>
                      <img src={horizontalRelativeCollision} alt="水平相対衝突のイラスト"/>
                  </div>
                )}
                {collisionPattern === 'slope' && (
                  <div className="glossary-item">
                      <h3>質量 (m), 速度 (v), 傾斜長 (L), 傾斜角 (θ), 推進力 (F)</h3>
                      <p>各項目が衝突のどの部分を指すかは、下の「斜面衝突」の図をご覧ください。</p>
                      <img src={slopeCollision} alt="斜面衝突のイラスト"/>
                  </div>
                )}
                <div className="glossary-item">
                    <h3>緩衝点の数 (N1) と 取付方法 (N2)</h3>
                    <p><b>緩衝点の数 (N1):</b> 衝突する際に、同時に何個の緩衝器でエネルギーを受け止めるか、その数を指定します。（例：クレーンガーターの両端で合計2個など）</p>
                    <p><b>取付方法 (N2):</b> 緩衝器を「片側だけ」に付けるか、「両側」に付けるかを指定します。片側なら1、両側なら2を入力します。</p>
                </div>
            </div>
          </div>
        </div>

        {error && <div className="error">エラー: {error}</div>}
        {result && (
          <div className="result">
            <h2>選定結果</h2>
            <p><strong>選定モデル:</strong> {result.selected_model}</p>
            <p>{result.message}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
