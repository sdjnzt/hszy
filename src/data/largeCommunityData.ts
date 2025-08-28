// 大型社区人口数据
import { Resident, Household } from '../pages/PopulationManagementPage';

// 基础数据
const surnames = [
  '张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴',
  '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
  '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
  '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕'
];

const maleNames = [
  '伟', '强', '磊', '军', '勇', '涛', '明', '超', '华', '健',
  '峰', '辉', '杰', '鹏', '志', '建', '国', '刚', '东', '文',
  '斌', '飞', '星', '宇', '龙', '浩', '博', '凯', '亮', '俊'
];

const femaleNames = [
  '丽', '娜', '敏', '静', '华', '秀', '慧', '巧', '美', '娟',
  '英', '欣', '婷', '雯', '倩', '文', '琳', '芳', '莉', '红',
  '玲', '梅', '艳', '洁', '雪', '霞', '萍', '燕', '君', '宁'
];

const educations = ['小学', '初中', '高中', '中专', '大专', '本科', '硕士', '博士'];
const occupations = [
  '软件工程师', '教师', '医生', '护士', '警察', '公务员', '律师', '会计',
  '工程师', '设计师', '销售', '经理', '技术员', '服务员', '司机', '厨师',
  '保安', '清洁工', '快递员', '外卖员', '银行职员', '保险员', '房产经纪',
  '导游', '翻译', '记者', '编辑', '摄影师', '美容师', '理发师', '修理工',
  '电工', '木工', '瓦工', '油漆工', '园丁', '保姆', '月嫂', '退休',
  '学生', '自由职业', '个体户', '农民', '工人', '职员', '营业员', '收银员'
];

const buildings = [
  '1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼', '7号楼', '8号楼',
  '9号楼', '10号楼', '11号楼', '12号楼', '13号楼', '14号楼', '15号楼', '16号楼',
  '17号楼', '18号楼', '19号楼', '20号楼'
];

const addresses = [
  '金宇路123号', '建设路456号', '和谐路789号', '幸福路888号', '民生路999号',
  '富民街111号', '康泰路222号', '安居路333号', '吉祥路444号', '如意路555号'
];

// 生成居民数据
function generateResident(id: number, familyInfo?: any): Resident {
  const gender = familyInfo?.gender || (Math.random() > 0.5 ? 'male' : 'female');
  const surname = familyInfo?.surname || surnames[Math.floor(Math.random() * surnames.length)];
  const nameList = gender === 'male' ? maleNames : femaleNames;
  const givenName = nameList[Math.floor(Math.random() * nameList.length)];
  const name = surname + givenName;

  // 年龄范围
  let ageRange = { min: 18, max: 80 };
  if (familyInfo?.role === 'child') {
    ageRange = { min: 0, max: 17 };
  } else if (familyInfo?.role === 'parent') {
    ageRange = { min: 25, max: 55 };
  } else if (familyInfo?.role === 'elderly') {
    ageRange = { min: 60, max: 85 };
  }

  const age = ageRange.min + Math.floor(Math.random() * (ageRange.max - ageRange.min + 1));
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;
  const birthMonth = 1 + Math.floor(Math.random() * 12);
  const birthDay = 1 + Math.floor(Math.random() * 28);
  const birthDate = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;

  // 身份证生成
  const prefix = '370811';
  const year = birthYear.toString();
  const month = birthMonth.toString().padStart(2, '0');
  const day = birthDay.toString().padStart(2, '0');
  const sequence = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  const checkCode = Math.floor(Math.random() * 10);
  const idCard = prefix + year + month + day + sequence + checkCode;

  // 手机号生成
  const phonePrefixes = ['138', '139', '150', '151', '152', '157', '158', '159', '178', '182', '183', '184', '187', '188'];
  const phonePrefix = phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)];
  const phoneSuffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  const phone = age >= 12 ? phonePrefix + phoneSuffix : '';

  // 婚姻状况
  let maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' = 'single';
  if (age >= 25 && Math.random() > 0.3) {
    maritalStatus = Math.random() > 0.1 ? 'married' : 'divorced';
  }
  if (familyInfo?.role === 'child') maritalStatus = 'single';

  // 职业和教育
  let occupation = '学生';
  let education = '小学';

  if (age >= 60 && Math.random() > 0.2) {
    occupation = '退休';
    education = educations[Math.floor(Math.random() * 6)];
  } else if (age >= 18) {
    occupation = occupations[Math.floor(Math.random() * occupations.length)];
    if (age >= 22) {
      education = educations[Math.floor(Math.random() * educations.length)];
    } else {
      education = educations[Math.floor(Math.random() * 4)];
    }
  } else if (age >= 15) {
    education = '高中';
  } else if (age >= 12) {
    education = '初中';
  }

  const building = familyInfo?.building || buildings[Math.floor(Math.random() * buildings.length)];
  const unit = familyInfo?.unit || `${1 + Math.floor(Math.random() * 3)}单元`;
  const room = familyInfo?.room || `${1 + Math.floor(Math.random() * 6)}0${1 + Math.floor(Math.random() * 6)}`;
  const address = familyInfo?.address || `${addresses[Math.floor(Math.random() * addresses.length)]}${unit}${room}`;

  const residenceType: 'owner' | 'tenant' | 'relative' | 'other' = Math.random() > 0.3 ? 'owner' : 'tenant';
  const politicalStatus = Math.random() > 0.8 ? '党员' : (Math.random() > 0.9 ? '团员' : '群众');
  const healthStatus: 'healthy' | 'chronic' | 'disabled' | 'other' = Math.random() > 0.85 ? 'chronic' : 'healthy';

  // 标签
  const tags = [];
  if (residenceType === 'owner') tags.push('业主');
  else tags.push('租户');

  if (politicalStatus === '党员') tags.push('党员');
  if (politicalStatus === '团员') tags.push('团员');
  if (occupation === '退休') tags.push('退休');
  if (occupation === '学生') tags.push('学生');
  if (['医生', '护士'].includes(occupation)) tags.push('医务工作者');
  if (['警察', '公务员'].includes(occupation)) tags.push('公职人员');
  if (age >= 70) tags.push('高龄老人');

  return {
    id: id.toString(),
    name,
    idCard,
    phone,
    gender,
    birthDate,
    age,
    nationality: '汉族',
    education,
    occupation,
    maritalStatus,
    address,
    building,
    unit,
    room,
    residenceType,
    moveInDate: `${2015 + Math.floor(Math.random() * 9)}-${(1 + Math.floor(Math.random() * 12)).toString().padStart(2, '0')}-${(1 + Math.floor(Math.random() * 28)).toString().padStart(2, '0')}`,
    householdRole: (familyInfo?.role as 'head' | 'spouse' | 'child' | 'parent' | 'other') || 'head',
    politicalStatus,
    healthStatus,
    emergencyContact: familyInfo?.emergencyContact || `${surname}家属`,
    emergencyPhone: phonePrefix + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
    registrationStatus: (residenceType === 'tenant' && Math.random() > 0.7 ? 'temporary' : 'registered') as 'registered' | 'temporary' | 'unregistered',
    tags,
    notes: ''
  };
}

// 生成家庭
function generateFamily(startId: number, building: string, unit: string, room: string) {
  const family = [];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const address = `${addresses[Math.floor(Math.random() * addresses.length)]}${unit}${room}`;

  const familySize = Math.random() > 0.7 ? 1 : (Math.random() > 0.6 ? 2 : (Math.random() > 0.3 ? 3 : 4));

  if (familySize === 1) {
    const resident = generateResident(startId, {
      surname,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      role: 'head',
      building,
      unit,
      room,
      address
    });
    family.push(resident);
  } else {
    let currentId = startId;

    // 户主
    const headGender = Math.random() > 0.5 ? 'male' : 'female';
    const head = generateResident(currentId++, {
      surname,
      gender: headGender,
      role: 'parent',
      building,
      unit,
      room,
      address
    });
    family.push(head);

    // 配偶
    if (familySize >= 2 && Math.random() > 0.2) {
      const spouse = generateResident(currentId++, {
        surname,
        gender: headGender === 'male' ? 'female' : 'male',
        role: 'parent',
        building,
        unit,
        room,
        address,
        emergencyContact: head.name
      });
      family.push(spouse);
    }

    // 子女
    const childrenCount = familySize - family.length;
    for (let i = 0; i < childrenCount; i++) {
      const child = generateResident(currentId++, {
        surname,
        gender: Math.random() > 0.5 ? 'male' : 'female',
        role: 'child',
        building,
        unit,
        room,
        address,
        emergencyContact: head.name
      });
      family.push(child);
    }
  }

  return family;
}

// 生成大型社区数据
export function generateLargeCommunityData() {
  const residents: Resident[] = [];
  const households: Household[] = [];
  let currentId = 1;
  let householdId = 1;

  for (const building of buildings) {
    const unitsPerBuilding = 3;
    const floorsPerUnit = 6;
    const roomsPerFloor = 2;

    for (let unitNum = 1; unitNum <= unitsPerBuilding; unitNum++) {
      const unit = `${unitNum}单元`;

      for (let floor = 1; floor <= floorsPerUnit; floor++) {
        for (let roomNum = 1; roomNum <= roomsPerFloor; roomNum++) {
          if (residents.length >= 1200) break;

          const room = `${floor}0${roomNum}`;

          // 80%的房屋有人居住
          if (Math.random() > 0.2) {
            const family = generateFamily(currentId, building, unit, room);
            residents.push(...family);
            currentId += family.length;

            // 创建户籍记录
            const household: Household = {
              id: householdId.toString(),
              address: family[0].address,
              building: family[0].building,
              unit: family[0].unit,
              room: family[0].room,
              householdHead: family[0].name,
              memberCount: family.length,
              members: family.map(r => r.id),
              registrationDate: family[0].moveInDate,
              householdType: (family.length === 1 ? 'single' : 'family') as 'family' | 'single' | 'group' | 'other',
              area: 60 + Math.floor(Math.random() * 80), // 60-140平米
              propertyType: (family[0].residenceType === 'owner' ? 'owned' : 'rented') as 'owned' | 'rented' | 'public' | 'other',
              status: 'active' as 'active' | 'moved' | 'demolished'
            };
            households.push(household);
            householdId++;
          }

          if (residents.length >= 1200) break;
        }
        if (residents.length >= 1200) break;
      }
      if (residents.length >= 1200) break;
    }
    if (residents.length >= 1200) break;
  }

  return { 
    residents: residents.slice(0, 1200), 
    households,
    buildings: buildings.slice(0, Math.ceil(residents.length / 60)) // 根据人口数量调整楼栋数
  };
}
