import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { HiOutlineExternalLink } from "react-icons/hi";
import {
  HiMiniChevronDown,
  HiMiniChevronUp,
  HiMiniHeart,
} from "react-icons/hi2";
import { FaPaperPlane } from "react-icons/fa6";
import { IoCodeSharp } from "react-icons/io5";

import { GifState } from "../context/context";
import Gif from "../components/Gif";
import FollowOn from "../components/FollowOn";

const contentType = ["gifs", "stickers", "texts"];

const SingleGif = () => {
  const { type, slug } = useParams();

  const [gifData, setGifData] = useState(null);
  const [relatedGifs, setRelatedGifs] = useState([]);
  const [readMore, setReadMore] = useState(false);

  const { gif, favorites, addToFavorites,setFavorites } = GifState();

  useEffect(() => {
    if (!contentType.includes(type)) return;

    const fetchGif = async () => {
      const parts = slug.split("-");
      const gifId = parts[parts.length - 1];

      const { data } = await gif.gif(gifId);
      const { data: related } = await gif.related(gifId, { limit: 10 });

      setGifData(data);
      setRelatedGifs(related);
    };

    fetchGif();
  }, [type, slug, gif]);

  const toggleFavorite = () => {
    if (!gifData) return;

    if (favorites.includes(gifData.id)) {
      setFavorites(favorites.filter((id) => id !== gifData.id));
    } else {
      setFavorites([...favorites, gifData.id]);
    }
  };

  const shareGif = () => {
    navigator.clipboard.writeText(gifData?.url);
  };

  const embedGif = () => {
    alert(`<iframe src="${gifData?.embed_url}" />`);
  };

  if (!gifData) return null;

  return (
    <div className="grid grid-cols-4 my-10 gap-4">
      {/* LEFT SIDEBAR */}
      <div className="hidden sm:block">
        {gifData.user && (
          <>
            <div className="flex gap-1">
              <img
                src={gifData.user.avatar_url}
                alt={gifData.user.display_name}
                className="h-14"
              />
              <div className="px-2">
                <div className="font-bold">
                  {gifData.user.display_name}
                </div>
                <div className="faded-text">
                  @{gifData.user.username}
                </div>
              </div>
            </div>

            {gifData.user.description && (
              <div className="py-4 text-sm text-gray-400">
                {readMore
                  ? gifData.user.description
                  : gifData.user.description.slice(0, 100) + "..."}
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
              </div>
            )}
          </>
        )}

        <FollowOn />
        <div className="divider" />

        {gifData.source && (
          <div>
            <span className="faded-text">Source</span>
            <div className="flex items-center text-sm font-bold gap-1">
              <HiOutlineExternalLink size={20} />
              <a
                href={gifData.source}
                target="_blank"
                rel="noreferrer"
                className="truncate"
              >
                {gifData.source}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="col-span-4 sm:col-span-3">
        <div className="flex gap-6">
          <div className="w-full sm:w-3/4">
            <div className="faded-text truncate mb-2">
              {gifData.title}
            </div>

            <Gif gif={gifData} hover={false} />

            {/* MOBILE USER INFO */}
            <div className="flex sm:hidden gap-2 mt-2">
              {gifData.user && (
                <>
                  <img
                    src={gifData.user.avatar_url}
                    alt={gifData.user.display_name}
                    className="h-14"
                  />
                  <div>
                    <div className="font-bold">
                      {gifData.user.display_name}
                    </div>
                    <div className="faded-text">
                      @{gifData.user.username}
                    </div>
                  </div>
                </>
              )}
              <button className="ml-auto" onClick={shareGif}>
                <FaPaperPlane size={22} />
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="hidden sm:flex flex-col gap-5 mt-6">
            <button
              onClick={()=>addToFavorites(gifData)}
              className="flex gap-4 items-center font-bold text-lg"
            >
              <HiMiniHeart
                size={30}
                className={
                  favorites.includes(gifData.id)
                    ? "text-red-500"
                    : ""
                }
              />
              Favorite
            </button>

            <button
              onClick={shareGif}
              className="flex gap-4 items-center font-bold text-lg"
            >
              <FaPaperPlane size={25} />
              Share
            </button>

            <button
              onClick={embedGif}
              className="flex gap-4 items-center font-bold text-lg"
            >
              <IoCodeSharp size={30} />
              Embed
            </button>
          </div>
        </div>

        {/* RELATED GIFS */}
        <div className="mt-6">
          <span className="font-extrabold">Related GIFs</span>
          <div className="columns-2 md:columns-3 gap-2 mt-2">
            {relatedGifs.map((gif) => (
              <Gif gif={gif} key={gif.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleGif;
