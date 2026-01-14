'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import FileUpload from '@/components/FileUpload'
import FileProcessor from '@/components/FileProcessor'
import ResultDisplay from '@/components/ResultDisplay'

interface ClassificationResult {
  field: string;
  meaning: string;
  classification?: string;
}

interface DataResults {
  type: 'table' | 'markdown';
  data: ClassificationResult[] | string;
}

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [aiRole, setAiRole] = useState<'classification' | 'governance'>('classification')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [showFileProcessor, setShowFileProcessor] = useState(false)
  const [processedData, setProcessedData] = useState<ClassificationResult[] | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<DataResults | null>(null)

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setShowFileProcessor(true)
    // 清除之前的结果
    setShowResults(false)
    setResults(null)
    setProcessedData(null)
  }

  const handleClearFile = () => {
    setUploadedFile(null)
    setShowFileProcessor(false)
    setShowResults(false)
    setResults(null)
    setProcessedData(null)
  }

  const handleRoleChange = (newRole: 'classification' | 'governance') => {
    setAiRole(newRole)
    // 清除之前的结果
    setShowResults(false)
    setResults(null)
    setProcessedData(null)
    setShowFileProcessor(false)
  }

  const updateFileProcessorVisibility = (file: File | null, role: 'classification' | 'governance') => {
    if (file && role === 'classification') {
      setShowFileProcessor(true)
    } else {
      setShowFileProcessor(false)
    }
  }

  const handleFileProcessComplete = (data: ClassificationResult[]) => {
    setProcessedData(data)
    setShowFileProcessor(false)
    
    // 模拟AI分类处理
    const classifiedData = data.map(item => ({
      ...item,
      classification: ['A级', 'B级', 'C级', 'D级'][Math.floor(Math.random() * 4)]
    }))
    
    setResults({ type: 'table', data: classifiedData })
    setShowResults(true)
  }

  const handleSubmit = () => {
    if (!inputText.trim() && !processedData) return

    if (aiRole === 'classification') {
      if (processedData) {
        // 使用文件处理的数据
        const classifiedData = processedData.map(item => ({
          ...item,
          classification: ['A级', 'B级', 'C级', 'D级'][Math.floor(Math.random() * 4)]
        }))
        setResults({ type: 'table', data: classifiedData })
      } else {
        // 使用默认示例数据
        const sampleData: ClassificationResult[] = [
          { field: 'user_id', meaning: '用户标识', classification: 'B级' },
          { field: 'email', meaning: '电子邮箱', classification: 'A级' },
          { field: 'phone', meaning: '手机号码', classification: 'A级' },
          { field: 'name', meaning: '姓名', classification: 'B级' },
          { field: 'address', meaning: '地址', classification: 'A级' },
        ]
        setResults({ type: 'table', data: sampleData })
      }
    } else {
      // 数据治理模式
      const markdownContent = `# 数据治理分析报告

## 数据质量评估

### 1. 数据完整性
- **评估结果**: 良好
- **完整率**: 95.2%
- **缺失字段**: 主要集中在可选字段

### 2. 数据一致性
- **评估结果**: 中等
- **一致性得分**: 78.5%
- **主要问题**: 
  - 日期格式不统一
  - 枚举值存在变体

### 3. 数据准确性
- **评估结果**: 优秀
- **准确率**: 97.8%
- **验证通过率**: 96.1%

## 治理建议

### 数据标准化
1. **建立统一的数据字典**
   - 定义标准字段名称
   - 规范数据类型和格式
   - 制定枚举值标准

2. **实施数据质量监控**
   - 设置数据质量指标
   - 建立自动化检查机制
   - 定期生成质量报告

### 数据安全与合规
1. **敏感数据识别与分类**
   - 个人身份信息(PII)保护
   - 商业机密数据管控
   - 合规性检查机制

2. **访问控制优化**
   - 基于角色的权限管理
   - 数据脱敏策略
   - 审计日志完善

## 实施路径

### 短期目标 (1-3个月)
- [ ] 完成数据字典建设
- [ ] 部署数据质量监控工具
- [ ] 建立数据治理团队

### 中期目标 (3-6个月)
- [ ] 实施数据标准化流程
- [ ] 完善数据安全策略
- [ ] 建立数据治理制度

### 长期目标 (6-12个月)
- [ ] 构建企业级数据治理平台
- [ ] 实现数据资产管理
- [ ] 建立数据价值评估体系`

      setResults({ type: 'markdown', data: markdownContent })
    }
    
    setShowResults(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 标题 */}
      <motion.div 
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">AI数据分类分级系统</h1>
        <p className="text-gray-600">智能数据分类与治理分析平台</p>
      </motion.div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* 文件处理器 */}
        <AnimatePresence>
          {showFileProcessor && uploadedFile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <FileProcessor 
                file={uploadedFile} 
                onProcessComplete={handleFileProcessComplete}
                onClearFile={handleClearFile}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 结果展示区域 */}
        <AnimatePresence>
          {showResults && results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <ResultDisplay results={results} aiRole={aiRole} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 输入区域 */}
        <motion.div
          layout
          transition={{ duration: 0.5 }}
          className={showResults || showFileProcessor ? '' : 'flex items-center justify-center min-h-[60vh]'}
        >
          <Card className={`w-full max-w-4xl mx-auto shadow-lg ${showResults || showFileProcessor ? 'mt-6' : ''}`}>
            <CardContent className="p-6">
              <div className="relative">
                <Textarea
                  placeholder="请输入您的数据分析需求..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[120px] pr-20 pb-16 border-2 border-gray-200 focus:border-blue-400 transition-colors"
                />
                
                {/* 左下角控制区域 */}
                <div className="absolute bottom-3 left-3 flex items-center gap-3">
                  <Select value={aiRole} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classification">数据分类</SelectItem>
                      <SelectItem value="governance">数据治理</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <FileUpload onFileUpload={handleFileUpload} />
                </div>

                {/* 右下角发送按钮 */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={handleSubmit}
                    className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    disabled={!inputText.trim() && !processedData}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    发送
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

