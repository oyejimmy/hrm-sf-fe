export interface Asset {
  id: number;
  name: string;
  asset_type: string;
  serial_number: string;
  assignment_date?: string;
  status: 'available' | 'assigned' | 'maintenance';
  specifications?: string;
  assigned_to?: number;
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