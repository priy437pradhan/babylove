import { useRef, useState } from 'react'
import { FiUploadCloud, FiImage, FiTrash2 } from 'react-icons/fi'
import { compressImageFile } from '../../utils/image'

/**
 * Photo field: paste a URL OR upload from the device.
 * Uploads are compressed and stored as data URLs inside the payload
 * (works fully offline in mock mode). With the real backend, replace
 * compressImageFile with an upload API call that returns a hosted URL.
 */
export default function ImageInput({ id, value = '', onChange, placeholder = 'https://… or upload a photo' }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const isUploaded = value.startsWith('data:')

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError(null)
    setBusy(true)
    try {
      onChange(await compressImageFile(file))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="image-input">
        <span className={`image-thumb ${value ? '' : 'is-empty'}`}>
          {value ? <img src={value} alt="" /> : <FiImage />}
        </span>
        <input
          id={id}
          value={isUploaded ? '' : value}
          placeholder={isUploaded ? 'Uploaded photo ✓' : placeholder}
          onChange={e => onChange(e.target.value)}
        />
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()} disabled={busy}>
          <FiUploadCloud /> {busy ? 'Adding…' : 'Upload'}
        </button>
        {value && (
          <button type="button" className="image-clear" onClick={() => onChange('')} aria-label="Remove photo">
            <FiTrash2 />
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
      </div>
      {error && <p className="field-error">{error}</p>}
    </>
  )
}
