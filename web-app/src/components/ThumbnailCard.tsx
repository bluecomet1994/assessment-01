import Image from "next/image";
import { Button } from '@mui/material';
import { ThumbnailCardProp } from "@/types/interface";

const ThumbnailCard = (props: ThumbnailCardProp) => {
  const { data, setter } = props;
  const { title, thumbnailUrl, album } = data;
  const { title: albumTitle, user } = album;

  return (
    <div className="w-1/5 p-2">
      <Button
        className="flex flex-col justify-normal items-center w-full h-full p-4 bg-orange-50 transition-all hover:-translate-y-2 cursor-pointer shadow-md fade"
        onClick={() => setter(data)}
      >
        <Image alt="thumbnail" width={150} height={150} src={thumbnailUrl} priority />
        <h2 className="font-bold text-blue-500 my-2">{albumTitle}</h2>
        <h1 className="text-sm normal-case">{title}</h1>
        <p className="my-4 normal-case">{user.email}</p>
      </Button>
    </div>
  )
}

export default ThumbnailCard;