import TagsTable from '@/components/TagsTable';
import { TagClassification } from '@/lib/types';

// 模拟数据
const mockData: TagClassification[] = [
  {
    id: '1',
    level1: '客户信息',
    level2: '个人信息',
    level3: '身份信息',
    level4: '姓名',
    sensitivityLevel: '高敏感',
  },
  {
    id: '2',
    level1: '客户信息',
    level2: '个人信息',
    level3: '身份信息',
    level4: '身份证号',
    sensitivityLevel: '高敏感',
  },
  {
    id: '3',
    level1: '客户信息',
    level2: '个人信息',
    level3: '联系方式',
    level4: '手机号',
    sensitivityLevel: '高敏感',
  },
  {
    id: '4',
    level1: '客户信息',
    level2: '个人信息',
    level3: '联系方式',
    level4: '电子邮箱',
    sensitivityLevel: '中等敏感',
  },
  {
    id: '5',
    level1: '客户信息',
    level2: '个人信息',
    level3: '地址信息',
    level4: '家庭住址',
    sensitivityLevel: '高敏感',
  },
  {
    id: '6',
    level1: '客户信息',
    level2: '企业信息',
    level3: '工商信息',
    level4: '企业名称',
    sensitivityLevel: '低敏感',
  },
  {
    id: '7',
    level1: '客户信息',
    level2: '企业信息',
    level3: '工商信息',
    level4: '统一社会信用代码',
    sensitivityLevel: '中等敏感',
  },
  {
    id: '8',
    level1: '财务信息',
    level2: '账户信息',
    level3: '银行账户',
    level4: '银行卡号',
    sensitivityLevel: '高敏感',
  },
  {
    id: '9',
    level1: '财务信息',
    level2: '账户信息',
    level3: '银行账户',
    level4: '开户行',
    sensitivityLevel: '中等敏感',
  },
  {
    id: '10',
    level1: '财务信息',
    level2: '交易信息',
    level3: '交易记录',
    level4: '交易金额',
    sensitivityLevel: '高敏感',
  },
  {
    id: '11',
    level1: '财务信息',
    level2: '交易信息',
    level3: '交易记录',
    level4: '交易时间',
    sensitivityLevel: '中等敏感',
  },
  {
    id: '12',
    level1: '财务信息',
    level2: '信用信息',
    level3: '征信数据',
    level4: '信用评分',
    sensitivityLevel: '高敏感',
  },
  {
    id: '13',
    level1: '产品信息',
    level2: '商品数据',
    level3: '商品属性',
    level4: '商品名称',
    sensitivityLevel: '公开',
  },
  {
    id: '14',
    level1: '产品信息',
    level2: '商品数据',
    level3: '商品属性',
    level4: '商品价格',
    sensitivityLevel: '低敏感',
  },
  {
    id: '15',
    level1: '产品信息',
    level2: '库存数据',
    level3: '库存量',
    level4: '当前库存',
    sensitivityLevel: '中等敏感',
  },
  {
    id: '16',
    level1: '运营信息',
    level2: '用户行为',
    level3: '访问记录',
    level4: '访问IP',
    sensitivityLevel: '中等敏感',
  },
  {
    id: '17',
    level1: '运营信息',
    level2: '用户行为',
    level3: '访问记录',
    level4: '访问时间',
    sensitivityLevel: '低敏感',
  },
  {
    id: '18',
    level1: '运营信息',
    level2: '用户行为',
    level3: '操作日志',
    level4: '操作类型',
    sensitivityLevel: '低敏感',
  },
  {
    id: '19',
    level1: '系统信息',
    level2: '日志数据',
    level3: '应用日志',
    level4: '错误日志',
    sensitivityLevel: '低敏感',
  },
  {
    id: '20',
    level1: '系统信息',
    level2: '配置信息',
    level3: '系统配置',
    level4: '版本号',
    sensitivityLevel: '公开',
  },
  {
    id: '21',
    level1: '客户信息',
    level2: '个人信息',
    level3: '生物特征',
    level4: '人脸特征',
    sensitivityLevel: '高敏感',
  },
  {
    id: '22',
    level1: '客户信息',
    level2: '个人信息',
    level3: '生物特征',
    level4: '指纹信息',
    sensitivityLevel: '高敏感',
  },
  {
    id: '23',
    level1: '财务信息',
    level2: '收入信息',
    level3: '工资数据',
    level4: '月收入',
    sensitivityLevel: '高敏感',
  },
  {
    id: '24',
    level1: '运营信息',
    level2: '营销数据',
    level3: '客户画像',
    level4: '兴趣标签',
    sensitivityLevel: '中等敏感',
  },
  {
    id: '25',
    level1: '产品信息',
    level2: '商品数据',
    level3: '销售数据',
    level4: '销售量',
    sensitivityLevel: '中等敏感',
  },
];

export default function Page() {
  return (
    <div className="h-full">
      <div className="flex flex-col h-full bg-white rounded-md border border-neutral-200/50 p-5">
        <div className="ml-4 flex-1 overflow-hidden">
          <TagsTable data={mockData} />
        </div>
      </div>
    </div>
  );
}
