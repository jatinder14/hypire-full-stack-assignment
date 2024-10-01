export const MAX_PROCESS = 8;

export type PackageType = {
  location: string;
  name: string;
};

export type MessageType = {
  cmd: string;
  pkg: PackageType;
  currentIndex: number;
  numberOfPackages: number;
};

export type WorkerMessageType = {
  success: boolean;
};
