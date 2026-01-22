import { NextResponse } from 'next/server';

// 数据类型定义
export interface SourceDataItem {
  table_name: string;
  field_name: string;
  field_desc: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  sensitivity_level: string;
}

// 模拟数据 - 用于开发环境
const mockData: SourceDataItem[] = [
  {
    table_name: 'daily_summary',
    field_name: 'mchnt_cd',
    field_desc: '商户代码',
    level1: '业务数据',
    level2: '基础信息',
    level3: '单位基础信息',
    level4: '单位入网信息',
    sensitivity_level: 'C',
  },
  {
    table_name: 'daily_summary',
    field_name: 'mchnt_tp',
    field_desc: '商户类型',
    level1: '业务数据',
    level2: '衍生信息',
    level3: '商户衍生信息',
    level4: '商户标签',
    sensitivity_level: 'C',
  },
  {
    table_name: 'daily_summary',
    field_name: 'pri_acct_no_conv',
    field_desc: '加密卡号',
    level1: '业务数据',
    level2: '基础信息',
    level3: '个人基础信息',
    level4: '个人银行卡信息',
    sensitivity_level: 'C',
  },
  {
    table_name: 'daily_summary',
    field_name: 'acpt_ins_id_cd',
    field_desc: '受理机构标识码',
    level1: '业务数据',
    level2: '基础信息',
    level3: '单位基础信息',
    level4: '单位入网信息',
    sensitivity_level: 'C',
  },
  {
    table_name: 'daily_summary',
    field_name: 'acq_ins_id_cd',
    field_desc: '收单机构标识码',
    level1: '业务数据',
    level2: '基础信息',
    level3: '单位基础信息',
    level4: '单位入网信息',
    sensitivity_level: 'C',
  },
  {
    table_name: 'daily_summary',
    field_name: 'afternoon_amt_sum',
    field_desc: '汇总-下午交易金额(12-17点)',
    level1: '业务数据',
    level2: '衍生信息',
    level3: '个人衍生信息',
    level4: '个人金额笔数类',
    sensitivity_level: 'C',
  },
  {
    table_name: 'daily_summary',
    field_name: 'afternoon_cnt_sum',
    field_desc: '汇总-下午交易笔数(12-17点)',
    level1: '业务数据',
    level2: '衍生信息',
    level3: '个人衍生信息',
    level4: '个人金额笔数类',
    sensitivity_level: 'C',
  },
  {
    table_name: 'daily_summary',
    field_name: 'amt_max',
    field_desc: '清算交易金额最大值',
    level1: '业务数据',
    level2: '衍生信息',
    level3: '个人衍生信息',
    level4: '个人金额笔数类',
    sensitivity_level: 'C',
  },
  {
    table_name: 'daily_summary',
    field_name: 'amt_min',
    field_desc: '清算交易金额最小值',
    level1: '业务数据',
    level2: '衍生信息',
    level3: '个人衍生信息',
    level4: '个人金额笔数类',
    sensitivity_level: 'C',
  },
  {
    table_name: 'daily_summary',
    field_name: 'amt_sum',
    field_desc: '清算交易金额求和',
    level1: '业务数据',
    level2: '衍生信息',
    level3: '个人衍生信息',
    level4: '个人金额笔数类',
    sensitivity_level: 'C',
  },
];

// =====================================================================
// 【重要】对接真实后端 API 的说明
// =====================================================================
// 当需要对接真实的后端 API 时，请按照以下步骤操作：
//
// 1. 在 .env 或 .env.local 文件中将 USE_MOCK_SOURCE_DATA 设置为 false
// 2. 在下面的 fetchFromRealApi() 函数中添加真实的 API 调用代码
// 3. 确保 API 返回的数据格式与 SourceDataItem 接口一致
//
// 示例代码（请根据实际情况修改）：
/*
async function fetchFromRealApi(): Promise<SourceDataItem[]> {
  const apiUrl = process.env.REAL_API_URL || 'https://your-api.com/source-data';
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_TOKEN}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // 如果后端返回的数据格式不同，这里需要做数据转换
  return data.map((item: any) => ({
    table_name: item.table_name,
    field_name: item.field_name,
    field_desc: item.field_desc_desc,
    level1: item.level1,
    level2: item.level2,
    level3: item.level3,
    level4: item.level4,
    sensitivity_level: item.sensitivity_level,
  }));
}
*/
// =====================================================================

// 模拟从真实 API 获取数据（当前返回模拟数据）
async function fetchFromRealApi(): Promise<SourceDataItem[]> {
  // TODO: 在这里添加真实的 API 调用代码
  // 当前直接返回模拟数据用于演示
  return mockData;
}

export async function GET() {
  try {
    // 检查是否使用模拟数据
    // 可以通过环境变量控制：USE_MOCK_SOURCE_DATA=true（默认为 true）
    const useMockData = process.env.USE_MOCK_SOURCE_DATA !== 'false';

    if (useMockData) {
      // 使用模拟数据
      // 添加延迟以模拟真实的网络请求
      await new Promise((resolve) => setTimeout(resolve, 500));
      return NextResponse.json({ data: mockData, source: 'mock' });
    } else {
      // 调用真实 API
      const data = await fetchFromRealApi();
      return NextResponse.json({ data, source: 'api' });
    }
  } catch (error) {
    console.error('Error fetching source data:', error);
    return NextResponse.json(
      {
        error: '获取数据失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 },
    );
  }
}
