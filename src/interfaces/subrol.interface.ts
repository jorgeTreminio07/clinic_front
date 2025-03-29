export interface ISubRol {
    id: string
    name: string
    rol: {
        id: string
        name: string
    };
    pages: {
        id: string
        url: string
    }[];
}
  