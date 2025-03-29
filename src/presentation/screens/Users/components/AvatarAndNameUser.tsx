import { Image } from "@nextui-org/react";

export interface IProps {
  name: string;
  url: string;
}
export function AvatarAndNameUser({ name, url }: IProps) {
  return (
    <div className="flex flex-row gap-4 items-center h-full">
      <Image src={url} className="rounded-full w-8" />
      <p>{name}</p>
    </div>
  );
}
