'use client';

import { Send, FileText, X, ArrowUp, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Textarea from 'react-textarea-autosize';
import FileUpload from '@/components/FileUpload';
import { Markdown } from '@/components/Markdown';
import CanvasBackground from '@/components/canvas-background';

export default function ChatPage() {
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    Array<{
      id: number;
      type: string;
      content: string;
      sender: 'user' | 'ai';
      timestamp: Date;
      file?: File;
    }>
  >([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (file: File | null) => {
    setUploadedFile(file);
    // 文件上传后不自动发送对话，只是设置文件状态
    // 用户可以通过后续的对话来处理文件
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
    setMessages((prev) => [...prev, clearMessage]);
  };

  // 生成基于上下文的模拟回复
  const generateMockResponse = (input: string, file?: File | null): string => {
    const lowerInput = input.toLowerCase();

    // 基础回复模板 - 增强版 Markdown 格式
    const responses = {
      greeting: [
        `你好！👋 我是AI数据治理助手，很高兴为你服务。

## 我的核心能力
| 功能领域 | 具体服务 | 专业程度 |
|----------|----------|----------|
| 📊 **数据分析** | 统计分析、趋势分析、异常检测 | ⭐⭐⭐⭐⭐ |
| 🗂️ **数据分类** | 智能分类、标签管理、数据整理 | ⭐⭐⭐⭐⭐ |
| 🛡️ **数据治理** | 质量管理、标准化、合规检查 | ⭐⭐⭐⭐⭐ |
| 📁 **文件处理** | Excel、CSV、JSON等格式处理 | ⭐⭐⭐⭐⭐ |

请告诉我你需要什么帮助！`,
        `您好！💼 我是专业的AI数据治理助手。

### 🎯 服务特色
- **🚀 高效处理**：快速分析大规模数据集
- **🔍 精准识别**：智能发现数据问题和模式
- **📋 专业建议**：提供行业最佳实践方案
- **🔧 实用工具**：内置多种数据处理函数

有什么数据治理方面的挑战需要解决吗？`,
        `你好！🎉 我可以协助你进行各种数据治理任务。

### 💡 我的优势
\`\`\`python
# 数据处理能力示例
def data_quality_analysis(df):
    return {
        'completeness': check_completeness(df),
        'accuracy': validate_accuracy(df),
        'consistency': ensure_consistency(df),
        'uniqueness': verify_uniqueness(df)
    }
\`\`\`

**支持的数据格式**：CSV、Excel、JSON、数据库、API等

有什么具体需求吗？`,
      ],
      dataAnalysis: [
        `## 📊 数据分析专业报告

### 🔍 数据质量评估
| 指标 | 数值 | 状态 | 建议 |
|------|------|------|------|
| 总记录数 | 15,234 | ✅ 正常 | 保持当前规模 |
| 缺失值率 | 2.3% | ⚠️ 需关注 | 建议填充或删除 |
| 重复记录 | 127 | ❌ 需处理 | 立即去重 |
| 异常值 | 89 | ⚠️ 需关注 | 进一步验证 |

### 📈 趋势分析
\`\`\`sql
-- 数据趋势查询示例
SELECT 
    DATE(created_at) as date,
    COUNT(*) as record_count,
    AVG(value) as avg_value
FROM data_table 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY date;
\`\`\`

### 🎯 关键发现
1. **📅 时间模式**：工作日数据量明显高于周末
2. **📊 数值分布**：符合正态分布，均值稳定
3. **⚠️ 异常检测**：发现3个异常峰值需要调查

请告诉我你希望深入分析哪个方面？`,
        `## 🔬 数据深度分析方案

### 📋 分析步骤清单
#### ✅ 第一阶段：数据概览
- [x] 数据基本信息统计
- [x] 缺失值和重复值检查
- [x] 数据类型验证

#### 🔄 第二阶段：深入分析
- [ ] 相关性分析
- [ ] 聚类分析
- [ ] 异常检测

#### 🎯 第三阶段：洞察提取
- [ ] 趋势预测
- [ ] 关键指标识别
- [ ] 业务建议生成

### 🛠️ 推荐工具
\`\`\`python
# 数据分析工具包
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
\`\`\`

你希望从哪个阶段开始？`,
        `## 📈 数据分析方法论

### 🎨 分析维度
\`\`\`mermaid
graph TD
    A[原始数据] --> B[数据清洗]
    B --> C[探索性分析]
    C --> D[统计分析]
    D --> E[机器学习]
    E --> F[业务洞察]
\`\`\`

### 📊 关键指标看板
| 指标类别 | 具体指标 | 当前值 | 目标值 | 趋势 |
|----------|----------|--------|--------|------|
| **数据质量** | 完整性 | 97.7% | >99% | 📈 |
| **数据质量** | 准确性 | 94.2% | >95% | 📈 |
| **业务价值** | 转化率 | 23.5% | >25% | 📉 |
| **技术性能** | 处理速度 | 1.2s | <1s | 📉 |

### 💡 改进建议
1. **🔧 优化数据管道**：提升处理效率
2. **📊 增强监控**：实时数据质量监控
3. **🤖 自动化分析**：减少人工干预

需要我详细解释某个方面吗？`,
      ],
      fileProcessing: [
        `## 📁 文件处理分析报告

### 📋 文件基本信息
| 属性 | 值 | 评估 |
|------|-----|------|
| **文件名** | ${file?.name || 'data.csv'} | ✅ 标准格式 |
| **文件大小** | ${
          file ? `${Math.round(file.size / 1024)}KB` : '1.2MB'
        } | ✅ 适中大小 |
| **文件类型** | ${file?.type || 'text/csv'} | ✅ 支持格式 |
| **预估记录数** | ${
          file ? `${Math.floor(Math.random() * 10000 + 5000)}` : '8,456'
        } | ✅ 可处理规模 |

### 🔍 数据预览
\`\`\`csv
id,name,category,value,status,created_at
1,产品A,电子,125.50,active,2024-01-15
2,产品B,服装,89.99,pending,2024-01-16
3,产品C,食品,45.00,active,2024-01-17
... (共 ${file ? `${Math.floor(Math.random() * 10000 + 5000)}` : '8,456'} 行)
\`\`\`

### 📊 数据结构分析
| 列名 | 数据类型 | 非空值 | 唯一值 | 质量 |
|------|----------|--------|--------|------|
| id | integer | 100% | 100% | ✅ 完美 |
| name | string | 99.8% | 95.2% | ✅ 良好 |
| category | string | 100% | 12 | ✅ 正常 |
| value | decimal | 99.5% | - | ⚠️ 需关注 |
| status | string | 100% | 3 | ✅ 正常 |

### 🛠️ 处理建议
#### 🔥 高优先级
1. **数据清洗**
   - 处理 value 列的缺失值 (0.5%)
   - 验证 name 列的唯一性

#### ⚠️ 中优先级
2. **数据优化**
   - category 列标准化
   - 添加数据验证规则

#### 💡 低优先级
3. **功能增强**
   - 创建数据索引
   - 建立更新机制

希望按哪种方案处理？`,
        `## 🎯 文件数据处理方案

### 📊 文件分析摘要
\`\`\`json
{
  "file_info": {
    "name": "${file?.name || 'dataset.csv'}",
    "size": "${file ? `${Math.round(file.size / 1024)}KB` : '2.1MB'}",
    "type": "${file?.type || 'application/csv'}",
    "encoding": "UTF-8"
  },
  "data_summary": {
    "total_rows": ${
      file ? `${Math.floor(Math.random() * 20000 + 10000)}` : '15,234'
    },
    "total_columns": 8,
    "memory_usage": "4.2MB"
  }
}
\`\`\`

### 🔧 数据处理流程
\`\`\`mermaid
graph LR
    A[文件上传] --> B[格式检测]
    B --> C[数据解析]
    C --> D[质量检查]
    D --> E[数据清洗]
    E --> F[结构化处理]
    F --> G[分析报告]
\`\`\`

### 📈 处理结果预览
#### 数据质量评分
| 维度 | 得分 | 满分 | 状态 |
|------|------|------|------|
| 完整性 | 92/100 | 100 | ⚠️ 良好 |
| 准确性 | 88/100 | 100 | ⚠️ 良好 |
| 一致性 | 95/100 | 100 | ✅ 优秀 |
| 及时性 | 100/100 | 100 | ✅ 完美 |

#### 推荐操作
\`\`\`python
# 数据处理脚本示例
import pandas as pd

def process_file(file_path):
    # 读取文件
    df = pd.read_csv(file_path)
    
    # 数据清洗
    df = df.drop_duplicates()
    df = df.fillna(method='ffill')
    
    # 数据验证
    assert df.isnull().sum().sum() == 0
    
    return df
\`\`\`

你希望我执行哪种处理方案？`,
        `## 🚀 文件内容智能分析

### 📋 文件元数据
| 特性 | 描述 | 值 |
|------|------|-----|
| **文件标识** | 唯一ID | FILE_${Date.now()} |
| **处理状态** | 当前进度 | 100% 完成 |
| **风险等级** | 数据风险 | 🟡 低风险 |
| **推荐行动** | 下一步 | ✅ 可安全处理 |

### 🎯 内容分析结果
#### 数据分布概览
\`\`\`
字段统计信息：
- 数值型字段: 4个
- 分类型字段: 3个  
- 日期型字段: 1个
- 文本型字段: 2个
\`\`\`

#### 质量评估矩阵
| 质量维度 | 评分 | 问题数量 | 严重程度 |
|----------|------|----------|----------|
| 完整性 | 9.2/10 | 23 | 🟡 轻微 |
| 唯一性 | 9.8/10 | 5 | 🟢 极好 |
| 有效性 | 8.9/10 | 45 | 🟡 轻微 |
| 一致性 | 9.5/10 | 12 | 🟢 极好 |

### 🛠️ 处理建议清单
#### ✅ 立即执行
1. **基础清洗**
   - 移除完全重复的记录
   - 填充明显的缺失值

#### 🔄 计划执行  
2. **深度处理**
   - 标准化分类字段
   - 验证数值范围合理性

#### 📋 后续优化
3. **长期维护**
   - 建立数据质量监控
   - 设置自动化验证规则

### 💼 业务价值评估
\`\`\`markdown
## ROI 分析
- **数据质量提升**: 预计 35%
- **处理效率提升**: 预计 60%  
- **决策准确性**: 预计 45%
- **总体投资回报**: 预计 280%
\`\`\`

需要我开始执行处理流程吗？`,
      ],
      help: [
        `## 🎯 AI数据治理助手 - 完整服务指南

### 📊 核心服务矩阵
| 服务类别 | 具体功能 | 技术栈 | 适用场景 |
|----------|----------|--------|----------|
| **🔍 数据分析** | 统计分析、趋势预测、异常检测 | Python, R, SQL | 业务决策支持 |
| **🗂️ 数据分类** | 智能标注、自动分类、标签管理 | ML, NLP, 规则引擎 | 内容组织管理 |
| **🛡️ 数据治理** | 质量监控、标准化、合规检查 | 数据质量工具, 元数据管理 | 企业数据管理 |
| **📁 文件处理** | 多格式解析、数据转换、批量处理 | ETL工具, 解析库 | 数据集成工程 |

### 🚀 快速开始指南

#### 1️⃣ 数据分析服务
\`\`\`python
# 数据分析示例
import pandas as pd
import numpy as np

def comprehensive_analysis(df):
    """全面数据分析"""
    report = {
        'basic_stats': df.describe(),
        'quality_score': calculate_quality_score(df),
        'anomalies': detect_anomalies(df),
        'trends': analyze_trends(df)
    }
    return report
\`\`\`

**使用场景：**
- 📈 业务数据趋势分析
- 🔍 数据质量问题识别  
- 📊 统计报告生成

#### 2️⃣ 数据分类服务
\`\`\`python
# 智能分类示例
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

def intelligent_classification(data, categories):
    """智能数据分类"""
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(data)
    
    classifier = MultinomialNB()
    classifier.fit(X, categories)
    
    return classifier
\`\`\`

**分类类型：**
- 🏷️ 内容主题分类
- 📂 文档类型识别
- 👥 用户画像分群

#### 3️⃣ 数据治理服务
\`\`\`python
# 数据治理框架
class DataGovernanceFramework:
    def __init__(self):
        self.quality_rules = self._load_quality_rules()
        self.compliance_standards = self._load_standards()
    
    def audit_data_quality(self, dataset):
        """数据质量审计"""
        return {
            'completeness': self.check_completeness(dataset),
            'accuracy': self.validate_accuracy(dataset),
            'consistency': self.ensure_consistency(dataset)
        }
\`\`\`

**治理范围：**
- 📋 数据标准制定
- 🔍 质量监控告警
- 📊 合规性检查

#### 4️⃣ 文件处理服务
\`\`\`python
# 多格式文件处理
class FileProcessor:
    def __init__(self):
        self.supported_formats = ['csv', 'xlsx', 'json', 'xml', 'parquet']
    
    def process_file(self, file_path, operations):
        """文件处理流水线"""
        result = {
            'original_file': file_path,
            'operations_applied': operations,
            'output_files': [],
            'processing_log': []
        }
        
        return self._execute_pipeline(result)
\`\`\`

**处理能力：**
- 📁 多格式支持
- 🔄 批量处理
- 📋 转换验证

### 💡 最佳实践建议

#### 🎯 数据分析最佳实践
1. **明确分析目标**
   - 定义关键业务问题
   - 确定成功指标

2. **数据质量优先**
   - 先清洗，后分析
   - 建立数据质量基线

3. **迭代分析方法**
   - 从描述性分析开始
   - 逐步深入到预测性分析

#### 🛡️ 数据治理最佳实践
1. **建立治理框架**
   - 制定数据标准
   - 明确责任分工

2. **持续监控机制**
   - 实时质量监控
   - 定期合规审计

3. **技术工具支撑**
   - 自动化治理工具
   - 元数据管理平台

### 📞 联系支持
如需定制化解决方案，请提供：
- 📋 具体业务需求
- 📊 当前数据状况  
- 🎯 期望达成目标
- ⏰ 项目时间要求

我已准备好为您提供专业的数据治理服务！`,
        `## 🛠️ 数据治理工具箱 - 实用指南

### 🎯 我的核心能力详解

#### 🔍 数据分析模块
##### 统计分析套件
\`\`\`python
# 全面统计分析工具
class StatisticalAnalyzer:
    def __init__(self):
        self.methods = ['descriptive', 'inferential', 'predictive']
    
    def descriptive_analysis(self, data):
        """描述性统计分析"""
        return {
            'central_tendency': {
                'mean': data.mean(),
                'median': data.median(),
                'mode': data.mode().iloc[0]
            },
            'dispersion': {
                'std': data.std(),
                'variance': data.var(),
                'range': data.max() - data.min()
            },
            'distribution': {
                'skewness': data.skew(),
                'kurtosis': data.kurtosis()
            }
        }
    
    def correlation_analysis(self, data):
        """相关性分析"""
        correlation_matrix = data.corr()
        strong_correlations = []
        
        for i in range(len(correlation_matrix.columns)):
            for j in range(i+1, len(correlation_matrix.columns)):
                corr_val = correlation_matrix.iloc[i, j]
                if abs(corr_val) > 0.7:
                    strong_correlations.append({
                        'var1': correlation_matrix.columns[i],
                        'var2': correlation_matrix.columns[j],
                        'correlation': corr_val
                    })
        
        return {
            'correlation_matrix': correlation_matrix,
            'strong_correlations': strong_correlations
        }
\`\`\`

**应用场景：**
- 📈 业务指标趋势分析
- 🔍 变量关系挖掘
- 📊 数据质量评估

#### 🗂️ 数据分类引擎
##### 机器学习分类
\`\`\`python
# 智能分类系统
import torch
import torch.nn as nn
from transformers import BertTokenizer, BertModel

class IntelligentClassifier:
    def __init__(self):
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-chinese')
        self.model = BertModel.from_pretrained('bert-base-chinese')
        self.classifier = nn.Sequential(
            nn.Linear(768, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 64),
            nn.ReLU(),
            nn.Linear(64, len(self.categories))
        )
    
    def classify_text(self, text, categories):
        """文本智能分类"""
        inputs = self.tokenizer(text, return_tensors='pt', padding=True, truncation=True)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            embeddings = outputs.last_hidden_state.mean(dim=1)
            logits = self.classifier(embeddings)
            probabilities = torch.softmax(logits, dim=1)
            predicted_class = torch.argmax(probabilities, dim=1)
        
        return {
            'predicted_category': categories[predicted_class.item()],
            'confidence': probabilities.max().item(),
            'all_probabilities': {
                cat: prob.item() 
                for cat, prob in zip(categories, probabilities[0])
            }
        }
\`\`\`

**分类能力：**
- 📝 文档主题分类
- 👤 用户画像分群
- 🏷️ 产品标签管理

#### 🛡️ 数据治理框架
##### 质量监控体系
\`\`\`python
# 数据质量监控系统
class DataQualityMonitor:
    def __init__(self):
        self.quality_dimensions = {
            'completeness': self.check_completeness,
            'accuracy': self.check_accuracy,
            'consistency': self.check_consistency,
            'timeliness': self.check_timeliness,
            'validity': self.check_validity,
            'uniqueness': self.check_uniqueness
        }
    
    def comprehensive_audit(self, dataset):
        """全面数据质量审计"""
        audit_results = {}
        
        for dimension, check_func in self.quality_dimensions.items():
            try:
                result = check_func(dataset)
                audit_results[dimension] = {
                    'score': result['score'],
                    'issues': result['issues'],
                    'recommendations': result['recommendations'],
                    'status': self._evaluate_status(result['score'])
                }
            except Exception as e:
                audit_results[dimension] = {
                    'score': 0,
                    'issues': [f'检查失败: {str(e)}'],
                    'recommendations': ['修复检查逻辑'],
                    'status': 'error'
                }
        
        overall_score = np.mean([result['score'] for result in audit_results.values()])
        
        return {
            'overall_score': overall_score,
            'overall_status': self._evaluate_status(overall_score),
            'dimension_scores': audit_results,
            'priority_actions': self._generate_priority_actions(audit_results)
        }
\`\`\`

**治理功能：**
- 📊 实时质量监控
- 🔍 异常检测告警
- 📋 合规性检查

#### 📁 文件处理工具链
##### 多格式处理引擎
\`\`\`python
# 统一文件处理器
class UniversalFileProcessor:
    def __init__(self):
        self.format_handlers = {
            'csv': self._handle_csv,
            'xlsx': self._handle_excel,
            'json': self._handle_json,
            'xml': self._handle_xml,
            'parquet': self._handle_parquet,
            'avro': self._handle_avro
        }
    
    def process_pipeline(self, file_path, config):
        """文件处理流水线"""
        pipeline_results = {
            'file_info': self._extract_file_info(file_path),
            'validation_results': self._validate_file(file_path),
            'processing_steps': [],
            'output_files': [],
            'quality_metrics': {},
            'processing_log': []
        }
        
        # 执行处理步骤
        for step in config['processing_steps']:
            step_result = self._execute_processing_step(
                file_path, step, pipeline_results
            )
            pipeline_results['processing_steps'].append(step_result)
            
            if step_result['status'] == 'error':
                break
        
        # 生成质量报告
        pipeline_results['quality_metrics'] = self._generate_quality_report(
            pipeline_results
        )
        
        return pipeline_results
    
    def _execute_processing_step(self, file_path, step_config, context):
        """执行单个处理步骤"""
        step_type = step_config['type']
        step_params = step_config.get('parameters', {})
        
        try:
            if step_type == 'read':
                data = self._read_file(file_path, step_params)
                return {'status': 'success', 'data': data, 'output': None}
            
            elif step_type == 'clean':
                cleaned_data = self._clean_data(context['data'], step_params)
                return {'status': 'success', 'data': cleaned_data, 'output': None}
            
            elif step_type == 'transform':
                transformed_data = self._transform_data(
                    context['data'], step_params
                )
                return {'status': 'success', 'data': transformed_data, 'output': None}
            
            elif step_type == 'validate':
                validation_result = self._validate_data(
                    context['data'], step_params
                )
                return {'status': 'success', 'data': context['data'], 
                       'output': validation_result}
            
            elif step_type == 'export':
                output_path = self._export_data(
                    context['data'], step_params
                )
                return {'status': 'success', 'data': context['data'], 
                       'output': output_path}
            
        except Exception as e:
            return {
                'status': 'error',
                'error': str(e),
                'data': context.get('data'),
                'output': None
            }
\`\`\`

**处理能力：**
- 🔄 多格式支持
- ⚡ 高性能处理
- 📋 质量验证

### 🎯 选择建议
根据您的具体需求，我推荐：

1. **📊 数据分析需求** → 使用统计分析套件
2. **🗂️ 内容整理需求** → 使用智能分类引擎  
3. **🛡️ 质量管理需求** → 使用治理监控框架
4. **📁 批量处理需求** → 使用文件处理工具链

请告诉我您的具体场景，我会为您定制最佳解决方案！`,
        `## 🚀 数据治理能力全景图

### 📊 我的技术栈总览

#### 🔧 核心技术架构
\`\`\`mermaid
graph TB
    A[用户界面] --> B[API网关]
    B --> C[业务逻辑层]
    C --> D[数据处理引擎]
    D --> E[存储层]
    
    C --> F[AI模型服务]
    C --> G[规则引擎]
    C --> H[监控告警]
    
    D --> I[数据分析模块]
    D --> J[数据分类模块]
    D --> K[质量检查模块]
    D --> L[文件处理模块]
\`\`\`

### 🎯 详细能力矩阵

#### 📈 数据分析能力
| 能力维度 | 具体功能 | 技术实现 | 成熟度 |
|----------|----------|----------|--------|
| **描述性分析** | 基础统计、分布分析 | Pandas, NumPy | ⭐⭐⭐⭐⭐ |
| **诊断性分析** | 相关性、因果分析 | SciPy, Statsmodels | ⭐⭐⭐⭐⭐ |
| **预测性分析** | 趋势预测、机器学习 | Scikit-learn, TensorFlow | ⭐⭐⭐⭐ |
| **规范性分析** | 优化建议、决策支持 | OR-Tools, Gurobi | ⭐⭐⭐ |

**特色功能：**
- 🔍 **异常检测**：基于统计和机器学习的多维度异常识别
- 📊 **实时分析**：支持流式数据的实时统计分析
- 📈 **可视化报告**：自动生成专业的数据可视化报告

#### 🗂️ 数据分类能力
| 分类类型 | 算法支持 | 准确率 | 处理速度 |
|----------|----------|--------|----------|
| **文本分类** | BERT, RoBERTa, TextCNN | 92-95% | 中速 |
| **图像分类** | ResNet, ViT, EfficientNet | 88-93% | 中速 |
| **结构化数据** | Random Forest, XGBoost | 85-90% | 高速 |
| **时序数据** | LSTM, GRU, Transformer | 82-88% | 中速 |

**应用场景：**
- 📝 **文档智能分类**：自动识别文档类型和主题
- 👥 **用户画像分群**：基于行为数据的用户分群
- 🏷️ **产品标签管理**：智能产品分类和标签推荐

#### 🛡️ 数据治理能力
| 治理领域 | 核心功能 | 工具支持 | 自动化程度 |
|----------|----------|----------|------------|
| **数据质量** | 完整性、准确性、一致性检查 | 自研质量框架 | 90% |
| **元数据管理** | 数据字典、血缘追踪 | Atlas, DataHub | 85% |
| **数据安全** | 访问控制、敏感数据发现 | Ranger, Privacera | 80% |
| **合规管理** | 法规遵循、审计追踪 | 自研合规引擎 | 75% |

**治理特色：**
- 📊 **质量评分体系**：多维度数据质量量化评估
- 🔍 **血缘追踪**：完整的数据流转路径追踪
- 📋 **合规检查**：自动化的法规遵循检查

#### 📁 文件处理能力
| 文件格式 | 读取速度 | 写入速度 | 压缩支持 | 特殊功能 |
|----------|----------|----------|----------|----------|
| **CSV** | ⚡ 极快 | ⚡ 极快 | ✅ 支持 | 大文件分块处理 |
| **Excel** | ⚡ 快 | ⚡ 快 | ✅ 支持 | 多Sheet处理 |
| **JSON** | ⚡ 快 | ⚡ 快 | ✅ 支持 | Schema验证 |
| **Parquet** | ⚡ 快 | ⚡ 快 | ✅ 支持 | 列式存储优化 |
| **Avro** | ⚡ 快 | ⚡ 快 | ✅ 支持 | Schema演化 |
| **XML** | 🐌 慢 | 🐌 慢 | ✅ 支持 | XPath查询 |

**处理特色：**
- 🔄 **批量处理**：支持大规模文件的批量处理
- ⚡ **内存优化**：大文件的流式处理，内存占用低
- 📋 **格式转换**：支持多种格式间的相互转换

### 💡 实施建议

#### 🎯 分阶段实施策略
##### 第一阶段：基础建设 (1-2个月)
- [ ] 搭建数据处理基础设施
- [ ] 实现基础数据质量检查
- [ ] 部署文件处理引擎

##### 第二阶段：能力增强 (2-3个月)  
- [ ] 集成机器学习分类模型
- [ ] 实现高级数据分析功能
- [ ] 建立元数据管理体系

##### 第三阶段：智能优化 (3-4个月)
- [ ] 部署AI驱动的智能推荐
- [ ] 实现实时监控告警
- [ ] 建立自动化治理流程

#### 📊 预期收益
| 实施阶段 | 数据质量提升 | 处理效率提升 | 成本降低 | ROI |
|----------|--------------|--------------|----------|-----|
| **第一阶段** | 30% | 50% | 20% | 160% |
| **第二阶段** | 50% | 80% | 35% | 250% |
| **第三阶段** | 70% | 120% | 50% | 340% |

### 🎯 下一步行动
我建议从以下几个方面开始：

1. **🔍 需求调研**：深入了解您的具体业务需求
2. **📊 现状评估**：评估当前数据治理成熟度
3. **🎯 方案设计**：定制化解决方案设计
4. **🚀 试点实施**：选择关键场景进行试点

请告诉我您最关心哪个方面，我会为您提供详细的实施计划！`,
      ],
      default: [
        `## 💡 专业数据治理建议

感谢您的咨询！作为专业的AI数据治理助手，我为您提供以下建议：

### 🎯 当前数据治理最佳实践

#### 📊 数据质量评估框架
\`\`\`python
# 数据质量评估模型
class DataQualityFramework:
    def __init__(self):
        self.dimensions = {
            'completeness': 0.25,
            'accuracy': 0.25, 
            'consistency': 0.25,
            'timeliness': 0.25
        }
    
    def calculate_quality_score(self, dataset):
        """计算综合质量评分"""
        scores = {}
        for dimension, weight in self.dimensions.items():
            score = self._evaluate_dimension(dataset, dimension)
            scores[dimension] = score * weight
        
        total_score = sum(scores.values())
        return {
            'total_score': total_score,
            'dimension_scores': scores,
            'grade': self._score_to_grade(total_score)
        }
\`\`\`

#### 🛡️ 数据治理关键要素
| 要素 | 重要性 | 实施难度 | 建议优先级 |
|------|--------|----------|------------|
| **数据标准** | 🔴 高 | 🟡 中等 | P0 |
| **质量监控** | 🔴 高 | 🟢 简单 | P0 |
| **元数据管理** | 🟡 中等 | 🟡 中等 | P1 |
| **数据安全** | 🔴 高 | 🔴 困难 | P1 |
| **主数据管理** | 🟡 中等 | 🔴 困难 | P2 |

### 📋 实施路线图

#### 🚀 第一阶段 (0-3个月)
1. **基础建设**
   - [ ] 建立数据标准规范
   - [ ] 部署数据质量监控工具
   - [ ] 制定数据治理流程

#### 🎯 第二阶段 (3-6个月)
2. **能力提升**  
   - [ ] 实施元数据管理平台
   - [ ] 建立数据安全控制
   - [ ] 开展数据治理培训

#### 💡 第三阶段 (6-12个月)
3. **智能优化**
   - [ ] 引入AI驱动的数据治理
   - [ ] 建立自动化治理流程
   - [ ] 实现持续改进机制

### 🎯 针对性建议

基于您的具体需求，我建议：

1. **🔍 立即行动项**
   - 进行数据质量现状评估
   - 建立基础数据标准
   - 部署监控告警机制

2. **📈 中期发展项**  
   - 构建元数据管理体系
   - 实施数据分类和标签
   - 建立数据治理委员会

3. **🚀 长期战略项**
   - AI驱动的智能治理
   - 自动化数据运营
   - 数据价值量化体系

### 💼 预期收益
实施完整的数据治理体系后，预期可以获得：
- 📊 **数据质量提升**：60-80%
- ⚡ **决策效率提升**：40-60%  
- 💰 **运营成本降低**：30-50%
- 🛡️ **合规风险降低**：70-90%

请告诉我您的具体业务场景和当前痛点，我可以为您提供更加定制化的建议！`,
        `## 🔍 深度数据治理分析

您好！我理解您对数据治理的专业需求。让我为您提供一份详细的分析和建议：

### 📊 数据治理成熟度评估

#### 🎯 当前行业基准
\`\`\`markdown
## 数据治理成熟度模型

| 成熟度等级 | 特征描述 | 典型表现 | 改进重点 |
|------------|----------|----------|----------|
| **L1: 初始级** | 无序管理 | 被动响应问题 | 建立基础规范 |
| **L2: 可重复级** | 流程化管理 | 有标准流程 | 流程优化 |
| **L3: 定义级** | 标准化管理 | 量化指标监控 | 工具支撑 |
| **L4: 量化级** | 度量化管理 | 持续改进机制 | 智能化 |
| **L5: 优化级** | 创新化管理 | 预测性治理 | 价值驱动 |
\`\`\`

#### 📋 自评估检查清单
**数据质量管理**
- [x] 是否有明确的数据质量标准？
- [ ] 是否定期进行数据质量评估？
- [ ] 是否有数据质量问题跟踪机制？

**元数据管理**  
- [ ] 是否建立了统一的元数据字典？
- [ ] 是否支持数据血缘追踪？
- [ ] 是否提供元数据查询服务？

**数据安全治理**
- [x] 是否有数据分类分级制度？
- [ ] 是否实施数据访问控制？
- [ ] 是否有数据脱敏机制？

### 🛠️ 技术实施方案

#### 🏗️ 架构设计
\`\`\`mermaid
graph TB
    subgraph "数据治理平台架构"
        A[用户界面层] --> B[应用服务层]
        B --> C[数据服务层] 
        C --> D[存储计算层]
        
        B --> E[治理引擎]
        B --> F[质量监控]
        B --> G[元数据管理]
        B --> H[安全管控]
        
        E --> I[规则引擎]
        E --> J[工作流引擎]
        E --> K[通知引擎]
    end
\`\`\`

#### 🔧 核心组件设计
##### 1. 数据质量管理模块
\`\`\`python
class DataQualityManager:
    def __init__(self):
        self.quality_rules = QualityRuleRepository()
        self.assessment_engine = AssessmentEngine()
        self.reporting_service = ReportingService()
    
    def assess_data_quality(self, dataset_id):
        """数据质量评估"""
        # 获取质量规则
        rules = self.quality_rules.get_rules_by_dataset(dataset_id)
        
        # 执行质量检查
        results = []
        for rule in rules:
            result = self.assessment_engine.execute_rule(dataset_id, rule)
            results.append(result)
        
        # 生成质量报告
        report = self.reporting_service.generate_quality_report(
            dataset_id, results
        )
        
        return {
            'dataset_id': dataset_id,
            'overall_score': self._calculate_overall_score(results),
            'rule_results': results,
            'recommendations': self._generate_recommendations(results),
            'report': report
        }
\`\`\`

##### 2. 元数据管理模块  
\`\`\`python
class MetadataManager:
    def __init__(self):
        self.metadata_store = MetadataStore()
        self.lineage_tracker = LineageTracker()
        self.search_engine = MetadataSearchEngine()
    
    def register_metadata(self, metadata):
        """注册元数据"""
        # 验证元数据格式
        validated_metadata = self._validate_metadata(metadata)
        
        # 存储元数据
        metadata_id = self.metadata_store.save(validated_metadata)
        
        # 建立索引
        self.search_engine.index(metadata_id, validated_metadata)
        
        return metadata_id
    
    def trace_lineage(self, data_entity_id):
        """数据血缘追踪"""
        return self.lineage_tracker.trace_upstream(data_entity_id)
\`\`\`

### 📈 实施效果预期

#### 🎯 量化指标
| 指标类别 | 基线值 | 目标值 | 提升幅度 |
|----------|--------|--------|----------|
| **数据质量** | 65% | 85% | +30% |
| **治理效率** | 40% | 75% | +87.5% |
| **合规水平** | 50% | 80% | +60% |
| **用户满意度** | 60% | 85% | +41.7% |

#### 💼 业务价值
1. **📊 决策支持**
   - 数据可信度提升 60%
   - 报表生成时间缩短 70%

2. **🛡️ 风险控制**  
   - 数据泄露风险降低 80%
   - 合规检查覆盖率提升 90%

3. **💰 成本优化**
   - 数据维护成本降低 45%
   - 人工干预减少 65%

### 🚀 行动计划

#### 📅 近期计划 (1-3个月)
**Week 1-2: 需求调研**
- [ ] 业务部门访谈
- [ ] 现状评估分析
- [ ] 目标设定确认

**Week 3-6: 方案设计**
- [ ] 技术架构设计
- [ ] 实施路径规划
- [ ] 资源预算评估

**Week 7-12: 试点实施**
- [ ] 核心模块开发
- [ ] 试点场景验证
- [ ] 效果评估优化

#### 📋 中期计划 (3-6个月)
- [ ] 全面推广实施
- [ ] 用户培训赋能
- [ ] 运维体系建立

#### 🎯 长期计划 (6-12个月)
- [ ] 持续优化改进
- [ ] 智能化升级
- [ ] 价值量化评估

### 💡 关键成功因素

1. **👥 高层支持**：确保获得足够的资源投入
2. **🔄 跨部门协作**：建立有效的沟通协作机制  
3. **📊 度量体系**：建立科学的成效评估方法
4. **🎓 持续培训**：提升团队数据治理能力
5. **🚀 技术创新**：保持技术先进性和适用性

请告诉我您最关注的方面，我可以为您提供更加详细和针对性的实施方案！`,
        `## 🎉 欢迎使用AI数据治理助手！

很高兴为您服务！我是您的专业数据治理伙伴，致力于帮助您解决各种数据挑战。

### 🌟 我的核心价值

#### 💼 业务价值驱动
\`\`\`markdown
## 数据治理业务价值矩阵
| 价值维度 | 短期收益 | 长期收益 | 实施复杂度 |
|----------|----------|----------|------------|
| **📊 决策质量** | +25% | +60% | 🟡 中等 |
| **⚡ 运营效率** | +40% | +80% | 🟢 简单 |
| **🛡️ 风险控制** | +35% | +75% | 🟡 中等 |
| **💰 成本优化** | +20% | +50% | 🟢 简单 |
| **🚀 创新能力** | +15% | +90% | 🔴 困难 |
\`\`\`

#### 🎯 技术能力覆盖
- **🔍 智能分析**：机器学习驱动的深度数据洞察
- **🗂️ 自动分类**：AI赋能的智能数据分类和标签
- **🛡️ 质量保障**：全方位的数据质量监控和治理
- **📁 高效处理**：多格式文件的智能处理和转换

### 🚀 快速开始指南

#### 📋 第一步：明确您的需求
请告诉我您当前面临的具体挑战：

1. **📊 数据分析需求**
   - 业务数据趋势分析
   - 数据质量问题识别
   - 统计报告自动生成

2. **🗂️ 数据整理需求**
   - 大量数据智能分类
   - 重复数据去重处理
   - 数据标准化和规范化

3. **🛡️ 治理管理需求**
   - 数据质量监控体系
   - 元数据管理平台
   - 数据安全和合规管理

4. **📁 文件处理需求**
   - 多格式文件批量处理
   - 数据提取和转换
   - 大文件性能优化

#### 🔧 第二步：选择解决方案
根据您的需求，我会为您定制最适合的解决方案：

**场景A：数据质量提升**
\`\`\`python
# 数据质量提升方案
def improve_data_quality(dataset):
    """数据质量提升流程"""
    # 1. 质量评估
    quality_report = assess_data_quality(dataset)
    
    # 2. 问题识别
    issues = identify_quality_issues(quality_report)
    
    # 3. 清洗处理
    cleaned_data = clean_dataset(dataset, issues)
    
    # 4. 验证确认
    validation_result = validate_cleaning_result(cleaned_data)
    
    return {
        'original_data': dataset,
        'cleaned_data': cleaned_data,
        'quality_report': quality_report,
        'improvement_metrics': calculate_improvement(dataset, cleaned_data)
    }
\`\`\`

**场景B：智能数据分类**
\`\`\`python
# 智能数据分类方案
def intelligent_data_classification(data, categories):
    """智能数据分类流程"""
    # 1. 特征提取
    features = extract_features(data)
    
    # 2. 模型推理
    classification_results = classify_with_ml_model(features, categories)
    
    # 3. 置信度评估
    confidence_scores = evaluate_confidence(classification_results)
    
    # 4. 结果优化
    optimized_results = optimize_classification_results(
        classification_results, confidence_scores
    )
    
    return {
        'original_data': data,
        'classification_results': optimized_results,
        'confidence_scores': confidence_scores,
        'recommendations': generate_classification_recommendations(optimized_results)
    }
\`\`\`

**场景C：文件批量处理**
\`\`\`python
# 文件批量处理方案
def batch_file_processing(file_list, processing_config):
    """文件批量处理流程"""
    processing_results = []
    
    for file_path in file_list:
        try:
            # 1. 文件解析
            file_data = parse_file(file_path)
            
            # 2. 数据处理
            processed_data = process_data(file_data, processing_config)
            
            # 3. 质量检查
            quality_check = check_data_quality(processed_data)
            
            # 4. 结果输出
            output_path = save_processed_data(processed_data, file_path)
            
            processing_results.append({
                'file_path': file_path,
                'status': 'success',
                'output_path': output_path,
                'quality_score': quality_check['overall_score'],
                'processing_time': calculate_processing_time(file_path)
            })
            
        except Exception as e:
            processing_results.append({
                'file_path': file_path,
                'status': 'error',
                'error_message': str(e),
                'processing_time': calculate_processing_time(file_path)
            })
    
    return {
        'total_files': len(file_list),
        'successful_files': len([r for r in processing_results if r['status'] == 'success']),
        'failed_files': len([r for r in processing_results if r['status'] == 'error']),
        'success_rate': len([r for r in processing_results if r['status'] == 'success']) / len(file_list),
        'average_processing_time': sum(r['processing_time'] for r in processing_results) / len(processing_results),
        'details': processing_results
    }
\`\`\`

### 💡 专业建议

#### 🎯 数据治理最佳实践
1. **📋 制定标准**
   - 建立企业级数据标准规范
   - 统一数据定义和格式要求
   - 制定数据质量管理流程

2. **🔧 工具支撑**
   - 部署专业数据治理工具平台
   - 建立自动化监控和告警机制
   - 实施元数据管理系统

3. **👥 组织保障**
   - 成立数据治理委员会
   - 明确数据责任人制度
   - 建立数据治理绩效考核

4. **📊 持续改进**
   - 定期评估治理效果
   - 收集用户反馈意见
   - 优化治理流程和工具

#### 🚀 实施路径建议
**短期目标 (1-3个月)**
- 完成数据治理现状评估
- 建立基础数据质量监控
- 实施关键数据分类项目

**中期目标 (3-6个月)**
- 部署元数据管理平台
- 建立数据安全管控机制
- 开展数据治理培训推广

**长期目标 (6-12个月)**
- 实现智能化数据治理
- 建立数据价值评估体系
- 形成持续改进机制

### 🎯 下一步行动

为了更好地为您提供精准服务，建议您：

1. **📝 描述具体需求**
   - 您当前面临的主要数据挑战是什么？
   - 希望解决哪些具体问题？
   - 有什么特定的业务目标？

2. **📊 提供背景信息**
   - 当前数据规模和类型
   - 现有技术架构和工具
   - 团队技术能力和经验

3. **🎯 设定期望目标**
   - 希望达到什么样的效果？
   - 有什么时间节点要求？
   - 预算和资源投入情况？

有了这些信息，我就能为您量身定制最适合的解决方案！

请随时告诉我您的想法，我已经准备好为您提供专业的数据治理服务！🚀`,
      ],
    };

    // 根据输入内容选择合适的回复
    if (
      lowerInput.includes('你好') ||
      lowerInput.includes('hi') ||
      lowerInput.includes('hello')
    ) {
      return responses.greeting[
        Math.floor(Math.random() * responses.greeting.length)
      ];
    }

    if (lowerInput.includes('数据') && lowerInput.includes('分析')) {
      return responses.dataAnalysis[
        Math.floor(Math.random() * responses.dataAnalysis.length)
      ];
    }

    if (lowerInput.includes('文件') || lowerInput.includes('上传') || file) {
      return responses.fileProcessing[
        Math.floor(Math.random() * responses.fileProcessing.length)
      ];
    }

    if (
      lowerInput.includes('帮助') ||
      lowerInput.includes('怎么') ||
      lowerInput.includes('如何')
    ) {
      return responses.help[Math.floor(Math.random() * responses.help.length)];
    }

    // 默认回复
    return responses.default[
      Math.floor(Math.random() * responses.default.length)
    ];
  };

  const handleSubmit = async () => {
    if (!inputText.trim() || isLoading) return;

    // 保存当前文件信息，用于AI回复
    const currentFile = uploadedFile;

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      type: 'text',
      content: inputText,
      sender: 'user' as const,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = inputText;
    setInputText('');
    setError(null);
    setIsLoading(true);

    // 发送消息后清空文件框
    setUploadedFile(null);

    try {
      // 生成模拟回复内容
      const mockResponse = generateMockResponse(currentInput, currentFile);

      // 创建AI消息占位符
      const aiMessageId = Date.now() + 1;
      const aiMessage = {
        id: aiMessageId,
        type: 'text' as const,
        content: '',
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // 模拟流式显示效果
      let fullContent = '';
      for (let i = 0; i < mockResponse.length; i++) {
        // 添加小延迟模拟打字效果
        await new Promise((resolve) => setTimeout(resolve, 5));
        fullContent += mockResponse[i];
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, content: fullContent } : msg
          )
        );
      }
    } catch (error) {
      console.error('模拟对话错误:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '模拟对话服务暂时不可用，请稍后再试';
      setError(errorMessage);

      // 添加错误消息
      const errorMessageObj = {
        id: Date.now() + 1,
        type: 'text' as const,
        content: `抱歉，出现了错误: ${errorMessage}`,
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
          {/* 对话消息 */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-3xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'rounded-[var(--s-radius-s)] bg-[rgba(0,0,0,0.04)] text-[var(--s-color-text-primary)]'
                    : 'text-[var(--s-color-text-primary)]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    {message.type === 'file' && message.file && (
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-[var(--s-color-text-secondary)]" />
                        <span className="text-sm font-medium text-[var(--s-color-text-primary)]">
                          {message.file.name}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col gap-4 text-[rgba(0,0,0,0.85)]">
                      <Markdown>{message.content}</Markdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 问候语 - 只在没有消息时显示 */}
      {messages.length === 0 && (
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-center text-gray-800">
            你好，我是AI数据治理助手！
          </h1>
        </div>
      )}

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
                  e.preventDefault();
                  handleSubmit();
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
