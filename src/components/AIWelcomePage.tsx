import { FC } from "react";
import { HiLightningBolt, HiOutlineLightBulb } from "react-icons/hi";

interface AIWelcomePageProps {
  onSendMessage: (message: string) => void;
}

/**
 * AI欢迎页面组件
 * 
 * 显示欢迎信息和功能介绍，用户可以通过输入框发送消息开始对话
 */
const AIWelcomePage: FC<AIWelcomePageProps> = ({ onSendMessage }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-black text-white">
      {/* Logo */}
      <div className="mb-12 flex items-center">
        <div className="mr-4 text-5xl">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0ZM30 10C41.0457 10 50 18.9543 50 30C50 41.0457 41.0457 50 30 50C18.9543 50 10 41.0457 10 30C10 18.9543 18.9543 10 30 10Z" fill="white"/>
            <path d="M45 30L15 45L15 15L45 30Z" fill="white"/>
          </svg>
        </div>
        <h1 className="text-5xl font-bold">Grok</h1>
      </div>

      {/* 输入框 */}
      <div className="mb-16 w-full max-w-3xl rounded-full bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="随便问点什么"
            className="w-full bg-transparent px-4 py-2 text-white outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const target = e.target as HTMLInputElement;
                onSendMessage(target.value);
                target.value = "";
              }
            }}
          />
          <div className="flex items-center gap-4">
            <button 
              className="flex items-center gap-2 rounded-full px-3 py-1 text-gray-400 hover:bg-gray-700"
              onClick={() => onSendMessage("DeepSearch: ")}
            >
              <HiLightningBolt className="text-lg" />
              <span>DeepSearch</span>
            </button>
            <button 
              className="flex items-center gap-2 rounded-full px-3 py-1 text-gray-400 hover:bg-gray-700"
              onClick={() => onSendMessage("Think: ")}
            >
              <HiOutlineLightBulb className="text-lg" />
              <span>Think</span>
            </button>
            <button className="rounded-full bg-gray-700 p-2 text-white hover:bg-gray-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 功能介绍 */}
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold">Grok 3 is here.</h2>
        <p className="text-gray-400">Try our new features: DeepSearch and Think</p>
      </div>

      {/* 功能卡片 */}
      <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-gray-800 p-6">
          <div className="mb-2 flex items-center">
            <HiLightningBolt className="mr-2 text-xl" />
            <h3 className="text-xl font-semibold">DeepSearch</h3>
          </div>
          <p className="text-gray-400">
            利用Grok的快速处理搜索功能能进行深入搜索，以便提供详细、合理的答案。
          </p>
        </div>
        <div className="rounded-lg bg-gray-800 p-6">
          <div className="mb-2 flex items-center">
            <HiOutlineLightBulb className="mr-2 text-xl" />
            <h3 className="text-xl font-semibold">Think</h3>
          </div>
          <p className="text-gray-400">
            借助我们的推理模型解决数学、科学和编码中最困难的问题。
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIWelcomePage;
