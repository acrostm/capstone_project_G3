/*
 * @Descripttion : 随机生产名字
 * @Author       : wuhaidong
 * @Date         : 2023-05-10 11:26:41
 * @LastEditors  : wuhaidong
 * @LastEditTime : 2023-05-10 11:27:52
 */
const randomName = () => {
  const firstName = [
    'Emma',
    'Olivia',
    'Ava',
    'Isabella',
    'Sophia',
    'Mia',
    'Charlotte',
    'Amelia',
    'Harper',
    'Evelyn',
    'Abigail',
    'Emily',
    'Elizabeth',
    'Mila',
    'Ella',
    'Avery',
    'Sofia',
    'Camila',
    'Aria',
    'Scarlett',
  ];
  const lastName = [
    'Smith',
    'Johnson',
    'Brown',
    'Taylor',
    'Miller',
    'Wilson',
    'Moore',
    'Davis',
    'Anderson',
    'Jackson',
    'Parker',
    'Lee',
    'Garcia',
    'Martinez',
    'Clark',
  ];

  const randomFirstName =
    firstName[Math.floor(Math.random() * firstName.length)];
  const randomLastName = lastName[Math.floor(Math.random() * lastName.length)];

  const name = `${randomFirstName} ${randomLastName}`;

  return name;
};

export default randomName;
