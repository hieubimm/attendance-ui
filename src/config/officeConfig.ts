// Cấu hình vị trí văn phòng
export interface OfficeLocation {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

export interface OfficeConfig {
  // Danh sách các vị trí văn phòng
  officeLocations: OfficeLocation[];
  
  // Bán kính cho phép (tính bằng mét)
  allowedRadius: number;
}

// Cấu hình mặc định cho văn phòng
export const officeConfig: OfficeConfig = {
  // Danh sách các vị trí văn phòng
  officeLocations: [
    {
      lat: 21.013680758889606,
      lng: 105.85743733555769,
      name: 'STOP FOR COFFEE cơ sở Long Biên',
      address: '497 Đ. Nguyễn Văn Cừ, Ngọc Lâm, Long Biên, Hà Nội, Việt Nam'
    },
    {
      lat: 21.048646707991075,
      lng: 105.88108470317812,
      name: 'STOP FOR COFFEE cơ sở Lò Đúc', 
      address: '9A Ng. 108 P. Lò Đúc, Đồng Nhân, Hai Bà Trưng, Hà Nội, Việt Nam'
    },
    {
        lat: 20.990684,
        lng: 105.819621,
        name: 'Nhà tôi', 
        address: 'Nhà tôi'
      }
  ],
  
  // Bán kính cho phép: 50 mét
  allowedRadius: 50
}; 