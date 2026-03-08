
export interface LostPetCDto {
  name: string;
  species: string;
  breed: string;
  color: string;
  size: string;
  description: string;
  photo_url?: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  latitude: number;
  longitude: number;
  address: string;
  lost_date: string;
  is_active?: boolean;
}