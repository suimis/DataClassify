'use client';

import { Send, FileText, X, ArrowUp, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Textarea from 'react-textarea-autosize';
import FileUpload from '@/components/FileUpload';
import { Markdown } from '@/components/Markdown';
import CanvasBackground from '@/components/canvas-background';
import { useChat } from '@ai-sdk/react';

export default function ChatPage() {
  const { messages, sendMessage } = useChat();
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (file: File | null) => {
    setUploadedFile(file);
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    // 添加清除文件消息
    const clearMessage = {
      id: Date.now(),
      type: 'text',
      content: '已清除上传的文件',
      sender: 'user' as const,
      timestamp: new Date(),
    };
    setInputText((prev) => '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sendMessage({ text: inputText });
    setInputText('');
  };

  return (
    <div
      className={`flex-1 flex flex-col mb-6 ${
        messages.length === 0 ? '' : 'h-dvh overflow-y-hidden'
      }`}
    >
      {/* 在没有发生对话的时候显示Canvas背景 */}
      {messages.length === 0 && (
        <CanvasBackground gridSize={25} animationSpeed={0.18} />
      )}

      {/* 对话页面的蒙版 */}
      {messages.length == 0 && (
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            zIndex: 0,
            opacity: 1,
            backgroundImage:
              'linear-gradient(to top, rgba(255,255,255,0.7), transparent)',
            backgroundSize: '100% 35vh',
            backgroundPosition: 'bottom',
            backgroundRepeat: 'no-repeat',
            height: '35vh',
          }}
        />
      )}

      {messages.length == 0 && (
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            zIndex: 0,
            opacity: 1,
            backgroundImage:
              'linear-gradient(to bottom, rgba(255,255,255,0.7), transparent)',
            backgroundSize: '100% 35vh',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',
            height: '35vh',
          }}
        />
      )}

      {/* 对话内容区域 */}
      <div
        ref={contentRef}
        className={`${
          messages.length === 0 ? 'hidden' : 'flex-1 overflow-y-auto'
        }`}
      >
        <div className="container mx-auto py-4 px-4">
          {messages.map((message) => (
            <div key={message.id} className="ml-4">
              {message.role === 'user' ? 'User: ' : 'AI: '}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <div key={`${message.id}-${i}`}>
                        <Markdown>{part.text}</Markdown>
                      </div>
                    );
                }
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 底部输入区域 */}
      <section
        ref={inputRef}
        className={`w-full flex justify-center pb-4 mb-4 pt-4 z-100 ${
          messages.length === 0 ? 'mt-auto' : 'bg-background mt-auto'
        }`}
      >
        <div className="flex bg-white justify-center w-188 z-[90] border border-neutral-200/50 dark:border-white/15 rounded-2xl transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700">
          <div className="relative">
            <Textarea
              placeholder="发消息，开始你的数据治理之路..."
              rows={2}
              maxRows={5}
              tabIndex={0}
              spellCheck={false}
              value={inputText}
              autoFocus
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handleSubmit(e);
                }
              }}
              className={`mark-scroll-bar w-185 flex-1 input-color font-geist-mono resize-none min-w-xl border-0 p-2 text-sm min-h-24 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`}
            />

            {/* 左下角控制区域 */}
            <div className="mt-auto ml-2 mb-2 flex items-center gap-3">
              {uploadedFile ? (
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {uploadedFile.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearFile}
                    className="w-4 h-4"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <FileUpload onFileUpload={handleFileUpload} />
              )}
            </div>

            {/* 右下角发送按钮 */}
            <div>
              <button
                onClick={handleSubmit}
                className={`absolute bottom-3 right-3 size-8 flex justify-center items-center transition-all duration-200 rounded-full ${
                  inputText.trim() && !isLoading
                    ? 'bg-blue-500 cursor-pointer hover:bg-blue-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                disabled={!inputText.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2
                    size={18}
                    className="text-white font-semibold animate-spin"
                  />
                ) : (
                  <ArrowUp size={18} className={`text-white font-semibold`} />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
