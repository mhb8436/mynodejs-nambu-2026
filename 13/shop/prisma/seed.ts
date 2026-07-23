import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password1234', 10);

  // --- Users (역할별 계정) ---
  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password: passwordHash,
      name: '관리자',
      role: Role.ADMIN,
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: 'seller@demo.com' },
    update: {},
    create: {
      email: 'seller@demo.com',
      password: passwordHash,
      name: '김판매',
      role: Role.SELLER,
    },
  });

  const seller2 = await prisma.user.upsert({
    where: { email: 'seller2@demo.com' },
    update: {},
    create: {
      email: 'seller2@demo.com',
      password: passwordHash,
      name: '이마켓',
      role: Role.SELLER,
    },
  });

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@demo.com' },
    update: {},
    create: {
      email: 'buyer@demo.com',
      password: passwordHash,
      name: '박구매',
      role: Role.BUYER,
    },
  });

  const buyer2 = await prisma.user.upsert({
    where: { email: 'buyer2@demo.com' },
    update: {},
    create: {
      email: 'buyer2@demo.com',
      password: passwordHash,
      name: '최고객',
      role: Role.BUYER,
    },
  });

  // --- Categories ---
  const categoryNames = [
    '전자제품',
    '패션',
    '식품',
    '생활용품',
    '도서',
    '스포츠',
  ];

  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const cat = Object.fromEntries(categories.map((c) => [c.name, c]));

  // --- Products (판매자 + 카테고리 연결) ---
  // 이미 시드된 상품이 있으면 중복 생성하지 않음
  const existingProductCount = await prisma.product.count();
  if (existingProductCount === 0) {
    await prisma.product.create({
      data: {
        name: '무선 이어폰',
        description: '노이즈 캔슬링 지원 블루투스 이어폰',
        price: 89000,
        stock: 50,
        sellerId: seller.id,
        categories: {
          connect: [{ id: cat['전자제품'].id }],
        },
      },
    });

    await prisma.product.create({
      data: {
        name: '기계식 키보드',
        description: '텐키리스 적축 기계식 키보드',
        price: 129000,
        stock: 30,
        sellerId: seller.id,
        categories: {
          connect: [{ id: cat['전자제품'].id }, { id: cat['생활용품'].id }],
        },
      },
    });

    await prisma.product.create({
      data: {
        name: '베이직 티셔츠',
        description: '면 100% 오버핏 티셔츠 (화이트)',
        price: 25000,
        stock: 100,
        sellerId: seller.id,
        categories: {
          connect: [{ id: cat['패션'].id }],
        },
      },
    });

    await prisma.product.create({
      data: {
        name: '원두 커피 1kg',
        description: '에티오피아 예가체프 미디엄 로스트',
        price: 32000,
        stock: 80,
        sellerId: seller2.id,
        categories: {
          connect: [{ id: cat['식품'].id }],
        },
      },
    });

    await prisma.product.create({
      data: {
        name: '노트북 거치대',
        description: '알루미늄 각도 조절 노트북 스탠드',
        price: 45000,
        stock: 40,
        sellerId: seller2.id,
        categories: {
          connect: [{ id: cat['생활용품'].id }, { id: cat['전자제품'].id }],
        },
      },
    });

    await prisma.product.create({
      data: {
        name: 'NestJS 실전 가이드',
        description: 'NestJS로 REST API와 쇼핑몰을 만드는 실습서',
        price: 28000,
        stock: 60,
        sellerId: seller2.id,
        categories: {
          connect: [{ id: cat['도서'].id }],
        },
      },
    });

    await prisma.product.create({
      data: {
        name: '요가 매트',
        description: '논슬립 TPE 요가 매트 10mm',
        price: 35000,
        stock: 45,
        sellerId: seller.id,
        categories: {
          connect: [{ id: cat['스포츠'].id }, { id: cat['생활용품'].id }],
        },
      },
    });
  }

  const products = await prisma.product.findMany({
    orderBy: { id: 'asc' },
  });

  // --- Cart (구매자 장바구니 샘플) ---
  if (products.length >= 2) {
    await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: buyer.id,
          productId: products[0].id,
        },
      },
      update: { quantity: 1 },
      create: {
        userId: buyer.id,
        productId: products[0].id,
        quantity: 1,
      },
    });

    await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: buyer.id,
          productId: products[1].id,
        },
      },
      update: { quantity: 2 },
      create: {
        userId: buyer.id,
        productId: products[1].id,
        quantity: 2,
      },
    });
  }

  console.log('seed 완료');
  console.log('--- 계정 (비밀번호: password1234) ---');
  console.log(`  ADMIN  : ${admin.email}`);
  console.log(`  SELLER : ${seller.email}, ${seller2.email}`);
  console.log(`  BUYER  : ${buyer.email}, ${buyer2.email}`);
  console.log(`--- 카테고리 ${categories.length}개, 상품 ${products.length}개 ---`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
