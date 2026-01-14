'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { aiService } from '@/lib/ai-service';
import { Switch } from '@/components/ui/switch';

interface AIModelConfig {
  provider: string;
  modelName: string;
  apiKey: string;
  baseUrl: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

interface Settings {
  autoSave: boolean;
  notifications: boolean;
  language: string;
  theme: string;
}

export default function SettingsPage() {
  const [aiConfig, setAiConfig] = useState<AIModelConfig>({
    provider: 'deepseek',
    modelName: 'deepseek-chat',
    apiKey: '',
    baseUrl: 'https://api.deepseek.com/v1',
    maxTokens: 4000,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
  });

  const [settings, setSettings] = useState<Settings>({
    autoSave: true,
    notifications: true,
    language: 'zh-CN',
    theme: 'light',
  });

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [configStatus, setConfigStatus] = useState<
    'valid' | 'invalid' | 'unknown'
  >('unknown');

  // 初始化配置
  useEffect(() => {
    const currentConfig = aiService.getConfig();
    setAiConfig(currentConfig);
    validateConfig();
  }, []);

  const handleAIConfigChange = (
    key: keyof AIModelConfig,
    value: string | number
  ) => {
    const newConfig = { ...aiConfig, [key]: value };
    setAiConfig(newConfig);

    // 实时更新AI服务配置
    aiService.updateConfig(newConfig);
    validateConfig();
  };

  const handleSettingChange = (
    key: keyof Settings,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateConfig = () => {
    const validation = aiService.validateConfig();
    setConfigStatus(validation.isValid ? 'valid' : 'invalid');
    return validation.isValid;
  };

  const testConnection = async () => {
    if (!validateConfig()) {
      setTestResult('配置无效，请检查设置');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      // 发送一个简单的测试消息
      const result = await aiService.generateChat(
        [{ role: 'user', content: '请回复"连接测试成功"' }],
        {
          temperature: 0.1,
          maxTokens: 50,
        }
      );

      setTestResult('连接测试成功！AI响应正常。');
    } catch (error) {
      console.error('连接测试失败:', error);
      setTestResult(
        `连接测试失败: ${error instanceof Error ? error.message : '未知错误'}`
      );
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (!validateConfig()) {
      alert('AI配置无效，请检查设置');
      return;
    }

    console.log('保存设置:', { aiConfig, settings });
    // 这里可以添加保存到本地存储或后端的逻辑
    alert('设置已保存');
  };

  const handleReset = () => {
    const defaultConfig: AIModelConfig = {
      provider: 'deepseek',
      modelName: 'deepseek-chat',
      apiKey: '',
      baseUrl: 'https://api.deepseek.com/v1',
      maxTokens: 4000,
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0,
      presencePenalty: 0,
    };

    setAiConfig(defaultConfig);
    aiService.updateConfig(defaultConfig);
    validateConfig();

    setSettings({
      autoSave: true,
      notifications: true,
      language: 'zh-CN',
      theme: 'light',
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 页面标题 */}
      <div className="px-6 py-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">系统配置</h1>
        <p className="text-gray-600 mt-1">配置系统参数和用户偏好设置</p>
      </div>

      {/* 配置内容 */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6 max-w-4xl">
          <div className="grid gap-6">
            {/* AI模型配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  AI模型配置
                  {configStatus === 'valid' && (
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                  {configStatus === 'invalid' && (
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </CardTitle>
                <CardDescription>
                  配置AI模型的相关参数，影响对话和分析的准确性
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium" htmlFor="provider">
                      模型提供商
                    </Label>
                    <Select
                      value={aiConfig.provider}
                      onValueChange={(value: string) =>
                        handleAIConfigChange('provider', value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择提供商" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="deepseek">
                          DeepSeek
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="openai">
                          OpenAI
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium" htmlFor="modelName">
                      模型名称
                    </Label>
                    <Input
                      className="w-full"
                      id="modelName"
                      type="text"
                      value={aiConfig.modelName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleAIConfigChange('modelName', e.target.value)
                      }
                      placeholder="例如: deepseek-chat, gpt-3.5-turbo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium" htmlFor="apiKey">
                    API密钥
                  </Label>
                  <Input
                    className="w-full"
                    id="apiKey"
                    type="password"
                    value={aiConfig.apiKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleAIConfigChange('apiKey', e.target.value)
                    }
                    placeholder="输入您的API密钥"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium" htmlFor="baseUrl">
                    API基础URL
                  </Label>
                  <Input
                    className="w-full"
                    id="baseUrl"
                    type="text"
                    value={aiConfig.baseUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleAIConfigChange('baseUrl', e.target.value)
                    }
                    placeholder="例如: https://api.deepseek.com/v1"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      className="text-sm font-medium"
                      htmlFor="temperature"
                    >
                      创造性 (0-2)
                    </Label>
                    <Input
                      className="w-full"
                      id="temperature"
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={aiConfig.temperature}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleAIConfigChange(
                          'temperature',
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium" htmlFor="maxTokens">
                      最大令牌数
                    </Label>
                    <Input
                      className="w-full"
                      id="maxTokens"
                      type="number"
                      min="100"
                      max="8000"
                      step="100"
                      value={aiConfig.maxTokens}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleAIConfigChange(
                          'maxTokens',
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium" htmlFor="topP">
                      Top P (0-1)
                    </Label>
                    <Input
                      className="w-full"
                      id="topP"
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={aiConfig.topP}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleAIConfigChange('topP', parseFloat(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      className="text-sm font-medium"
                      htmlFor="frequencyPenalty"
                    >
                      频率惩罚
                    </Label>
                    <Input
                      className="w-full"
                      id="frequencyPenalty"
                      type="number"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={aiConfig.frequencyPenalty}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleAIConfigChange(
                          'frequencyPenalty',
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      className="text-sm font-medium"
                      htmlFor="presencePenalty"
                    >
                      存在惩罚
                    </Label>
                    <Input
                      className="w-full"
                      id="presencePenalty"
                      type="number"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={aiConfig.presencePenalty}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleAIConfigChange(
                          'presencePenalty',
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                {/* 连接测试 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      className="bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                      onClick={testConnection}
                      disabled={isTesting}
                      variant="outline"
                      size="sm"
                    >
                      {isTesting ? '测试中...' : '测试连接'}
                    </Button>
                    {testResult && (
                      <span
                        className={`text-sm ${
                          testResult.includes('成功')
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {testResult}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 用户偏好设置 */}
            {/* <Card>
              <CardHeader>
                <CardTitle>用户偏好</CardTitle>
                <CardDescription>个性化设置，提升使用体验</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">界面语言</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) =>
                        handleSettingChange('language', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择语言" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zh-CN">简体中文</SelectItem>
                        <SelectItem value="zh-TW">繁体中文</SelectItem>
                        <SelectItem value="en-US">English</SelectItem>
                        <SelectItem value="ja-JP">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">主题模式</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) =>
                        handleSettingChange('theme', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择主题" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">浅色模式</SelectItem>
                        <SelectItem value="dark">深色模式</SelectItem>
                        <SelectItem value="auto">跟随系统</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>自动保存</Label>
                    <p className="text-sm text-muted-foreground">
                      自动保存处理结果和配置更改
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) =>
                      handleSettingChange('autoSave', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>通知提醒</Label>
                    <p className="text-sm text-muted-foreground">
                      接收系统通知和更新提醒
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange('notifications', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card> */}

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-4">
              <Button
                className="bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                variant="outline"
                onClick={handleReset}
                size="default"
              >
                重置默认
              </Button>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                variant="default"
                onClick={handleSave}
                size="default"
              >
                保存设置
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
