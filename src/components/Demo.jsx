import { useState, useEffect, FormEvent } from "react";

import { copy, linkIcon, loader, tick } from "../assets";
import { CornerDownLeft } from "lucide-react";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllarticles] = useState([]);
  const [copied, setCopied] = useState("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articleFromLocalstorage = localStorage.getItem("articles");

    if (articleFromLocalstorage) {
      const jsonFormat = JSON.parse(articleFromLocalstorage);
      setAllarticles(jsonFormat);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticle = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllarticles(updatedAllArticle);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticle));
    }
  };

  const handleCopide = (url) => {
    setCopied(url);
    navigator.clipboard.writeText(url);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <section className=" mt-16 max-w-xl w-full">
      {/* search input */}
      <div className="flex flex-col gap-2 w-full">
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex relative justify-center items-center"
        >
          <img
            src={linkIcon}
            className=" absolute left-0 my-2 ml-3 w-5"
            alt="link-icon"
          />

          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            onChange={(e) => {
              setArticle({ ...article, url: e.target.value });
            }}
            required
            className="url_input peer"
          />

          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            <CornerDownLeft size={20} />
          </button>
        </form>

        {/* history url */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles
            ? allArticles.map((article, index) => (
                <div
                  key={`link-${index}`}
                  className="link_card"
                  onClick={() => setArticle(article)}
                >
                  <div
                    className="copy_btn"
                    onClick={() => handleCopide(article.url)}
                  >
                    <img
                      src={copied ? tick : copy}
                      className=" w-[40%] h-[40%] object-contain"
                      alt="copy-icon"
                    />
                  </div>
                  <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                    {article.url}
                  </p>
                </div>
              ))
            : null}
        </div>
      </div>

      {/* display result */}
      <div className="flex my-10 justify-center max-w-full items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn't supposed to happen...
            <br />
            <span className=" font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex gap-3 flex-col">
              <h2 className=" font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className=" font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
