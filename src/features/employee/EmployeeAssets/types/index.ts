export interface Asset {
  id: number;
  name: string;
  type: string;
  serialNumber: string;
  assignmentDate: string | null;
  status: string;
  specifications: string;
  custodian: string | null;
  department: string | null;
}

export interface Request {
  id: number;
  assetName: string;
  type: string;
  requestDate: string;
  status: string;
}

export interface ModalProps {
  asset: Asset | null;
  detailsModalVisible: boolean;
  requestModalVisible: boolean;
  returnModalVisible: boolean;
  onCloseDetails: () => void;
  onCloseRequest: () => void;
  onCloseReturn: () => void;
  onRequest: (requestData: any) => void;
  onReturn: (returnData: any) => void;
}

export interface TableProps {
  assetsData: Asset[];
  onViewDetails: (asset: Asset) => void;
  onRequestAsset: (asset: Asset | null) => void;
  onReturnAsset: (asset: Asset) => void;
}

export interface DashboardStatsProps {
  totalAssets: number;
  assignedAssets: number;
  availableAssets: number;
  pendingRequests: number;
}