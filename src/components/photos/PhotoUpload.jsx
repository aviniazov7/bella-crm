import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

/**
 * PhotoUpload — drag-and-drop (or click) image picker.
 * Returns the selected File via onSelect and shows a local preview.
 */
export function PhotoUpload({ label = 'גרור/י תמונה או לחץ/י', onSelect, preview }) {
  const [localPreview, setLocalPreview] = useState(preview || null)

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (!file) return
      setLocalPreview(URL.createObjectURL(file))
      onSelect?.(file)
    },
    [onSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-2
        overflow-hidden rounded-xl border-2 border-dashed p-3 text-center text-xs transition-colors
        ${isDragActive ? 'border-gold bg-gold/10' : 'border-ink-300 hover:border-rose'}`}
    >
      <input {...getInputProps()} aria-label={label} />
      {localPreview ? (
        <img
          src={localPreview}
          alt="תצוגה מקדימה"
          className="h-full w-full rounded-lg object-cover"
        />
      ) : (
        <>
          <span className="text-2xl text-gold/60" aria-hidden="true">
            ＋
          </span>
          <span className="text-rose-soft/60">{label}</span>
        </>
      )}
    </div>
  )
}

export default PhotoUpload
