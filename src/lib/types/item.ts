export type ItemType = string;

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  price: string;
  description: string;
  coverImage: string;
  images: string[];
}
