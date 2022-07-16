type args = {
  path: string;
};

enum FileVariant {
  Archive = "Archive",
  Directory = "Directory",
  RegularFile = "RegularFile",
}

export type Entry = {
  errMsg?: string;
  variant?: FileVariant;
  archivePath: string;
  absolutePath: string;
};

export type ListArchiveUC = (args: args) => AsyncGenerator<Entry, void, void>;
