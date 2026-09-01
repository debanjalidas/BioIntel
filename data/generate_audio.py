"""Generate clean sample bioacoustic WAV audio files for local PAM audio testing."""
import os
import wave
import struct
import math

AUDIO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "audio"))
os.makedirs(AUDIO_DIR, exist_ok=True)

def generate_wav(file_path, duration_s=6.0, sample_rate=44100, frequencies=[(800, 1.5), (1400, 2.0)]):
    num_samples = int(duration_s * sample_rate)
    with wave.open(file_path, 'w') as wav:
        wav.setnchannels(1)  # Mono
        wav.setsampwidth(2)  # 16-bit
        wav.setframerate(sample_rate)
        
        frames = bytearray()
        for i in range(num_samples):
            t = i / sample_rate
            # Synthesize natural bioacoustic harmonic blend with envelope
            sample_val = 0.0
            for freq, speed in frequencies:
                # Modulated bird / wildlife pitch chirp
                mod_freq = freq + 150.0 * math.sin(2 * math.pi * speed * t)
                envelope = (math.sin(math.pi * (t % 1.5) / 1.5)) ** 2 if (t % 2.0 < 1.5) else 0.05
                sample_val += envelope * math.sin(2 * math.pi * mod_freq * t)
            
            # Normalize and clamp to 16-bit signed integer
            sample_val = max(min(sample_val / len(frequencies), 0.9), -0.9)
            int_val = int(sample_val * 32767.0)
            frames.extend(struct.pack('<h', int_val))
            
        wav.writeframes(frames)
    print(f"[OK] Generated Bioacoustic Audio: {file_path} ({duration_s}s, {sample_rate}Hz)")

# 1. Tawny Owl / Nocturnal Call (lower frequency harmonics)
generate_wav(
    os.path.join(AUDIO_DIR, "tawny_owl_call.wav"),
    duration_s=8.0,
    frequencies=[(650, 0.8), (1100, 1.2)]
)

# 2. Canopy Dawn Chorus (rich multi-frequency bird chirps)
generate_wav(
    os.path.join(AUDIO_DIR, "forest_ambient_soundscape.wav"),
    duration_s=12.0,
    frequencies=[(1200, 2.5), (2400, 3.8), (3600, 5.0)]
)
