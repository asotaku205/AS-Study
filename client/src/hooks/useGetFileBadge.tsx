const FILE_TYPES = {
  PDF: [".pdf"],

  DOCX: [".doc", ".docx"],

  XLSX: [".xls", ".xlsx"],

  PPT: [".ppt", ".pptx"],

  IMAGE: [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],

  VIDEO: [".mp4", ".webm", ".mov", ".avi", ".mkv"],

  AUDIO: [".mp3", ".wav", ".ogg", ".aac", ".flac"],

  MD: [".md"],

  TXT: [".txt"],

  ZIP: [".zip", ".rar", ".7z"],
};

const useGetFileBadge = () => {
  const getFileBadge = (filePath: string) => {
    
    const extension =
      "." + filePath.split(".").pop()?.toLowerCase();

    for (const [label, extensions] of Object.entries(FILE_TYPES)) {
      if (extensions.includes(extension)) {
        return label;
      }
    }

    return "FILE";
  };

  return getFileBadge;
};

export default useGetFileBadge;