import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";


import {HiOutlineExternalLink} from "react-icons/hi";
import {HiMiniChevronDown, HiMiniChevronUp, HiMiniHeart} from "react-icons/hi2";
import {FaPaperPlane} from "react-icons/fa6";
import {IoCodeSharp} from "react-icons/io5";
import Gif from "../components/Gif";
import { GifState } from "../context/context";
import FollowOn from "../components/FollowOn";

const contentType = ["gifs", "stickers", "texts"];

const GifPage = () => {
  const {type, slug} = useParams();
  const [gifData, setGifData] = useState({});
  const [relatedGifs, setRelatedGifs] = useState([]);
  const [readMore, setReadMore] = useState(false);

  const {gif, addToFavorites, favorites} = GifState();

  useEffect(() => {
    if (!contentType.includes(type)) {
      throw new Error("Invalid Content Type");
    }
    const fetchGif = async () => {
      const gifId = slug.split("-");
      const {data} = await gif.gif(gifId[gifId.length - 1]);
      const {data: related} = await gif.related(gifId[gifId.length - 1], {
        limit: 10,
      });
      setGif(data);
      setRelatedGifs(related);
    };

    fetchGif();
  }, []);

  const shareGif = () => {
    // Assignment
  };

  const EmbedGif = () => {
    // Assignment
  };

  return (
    <div className="grid grid-cols-4 my-10 gap-4">
      <div className="hidden sm:block">
        {gifData?.user && (
          <>
            <div className="flex gap-1">
              <img
                src={gifData?.user?.avatar_url}
                alt={gifData?.user?.display_name}
                className="h-14"
              />
              <div className="px-2">
                <div className="font-bold">{gifData?.user?.display_name}</div>
                <div className="faded-text">@{gifData?.user?.username}</div>
              </div>
            </div>
            {gifData?.user?.description && (
              <p className="py-4 whitespace-pre-line text-sm text-gray-400">
                {readMore
                  ? gifData?.user?.description
                  : gifData?.user?.description.slice(0, 100) + "..."}
                <div
                  className="flex items-center faded-text cursor-pointer"
                  onClick={() => setReadMore(!readMore)}
                >
                  {readMore ? (
                    <>
                      Read less <HiMiniChevronUp size={20} />
                    </>
                  ) : (
                    <>
                      Read more <HiMiniChevronDown size={20} />
                    </>
                  )}
                </div>
              </p>
            )}
          </>
        )}
        <FollowOn />

        <div className="divider" />

        {gifData?.source && (
          <div>
            <span
              className="faded-text" //custom - faded-text
            >
              Source
            </span>
            <div className="flex items-center text-sm font-bold gap-1">
              <HiOutlineExternalLink size={25} />
              <a href={gifData.source} target="_blank" className="truncate">
                {gifData.source}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="col-span-4 sm:col-span-3">
        <div className="flex gap-6">
          <div className="w-full sm:w-3/4">
            <div className="faded-text truncate mb-2">{gifData.title}</div>
            <Gif gif={gifData} hover={false} />

            {/* -- Mobile UI -- */}
            <div className="flex sm:hidden gap-1">
              <img
                src={gifData?.user?.avatar_url}
                alt={gifData?.user?.display_name}
                className="h-14"
              />
              <div className="px-2">
                <div className="font-bold">{gifData?.user?.display_name}</div>
                <div className="faded-text">@{gifData?.user?.username}</div>
              </div>

              <button className="ml-auto" onClick={shareGif}>
                <FaPaperPlane size={25} />
              </button>
            </div>
            {/* -- Mobile UI -- */}
          </div>

          <div className="hidden sm:flex flex-col gap-5 mt-6">
            <button
              onClick={() => addToFavorites(gifData.id)}
              className="flex gap-5 items-center font-bold text-lg"
            >
              <HiMiniHeart
                size={30}
                className={`${
                  favorites.includes(gifData.id) ? "text-red-500" : ""
                }`}
              />
              Favorite
            </button>
            <button
              onClick={shareGif} // Assignment
              className="flex gap-6 items-center font-bold text-lg"
            >
              <FaPaperPlane size={25} />
              Share
            </button>
            <button
              onClick={EmbedGif} // Assignment
              className="flex gap-5 items-center font-bold text-lg"
            >
              <IoCodeSharp size={30} />
              Embed
            </button>
          </div>
        </div>

        <div>
          <span className="font-extrabold">Related GIFs</span>
          <div className="columns-2 md:columns-3 gap-2">
            {relatedGifs.slice(1).map((gif) => (
              <Gif gif={gif} key={gif.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GifPage;