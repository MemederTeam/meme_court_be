# Meme Court Backend 구조 문서

## 디렉토리 구조

```
meme_court_be/
├── src/
│   ├── main.ts                       # 앱 엔트리포인트 (Swagger, CORS, ValidationPipe)
│   ├── app.module.ts                 # 루트 모듈 (모든 모듈 import)
│   ├── app.controller.ts             # 헬스체크 컨트롤러
│   ├── app.service.ts                # 앱 서비스
│   │
│   ├── config/                       # 설정 파일
│   │   ├── database.config.ts        # TypeORM PostgreSQL 설정
│   │   └── supabase.config.ts        # Supabase 클라이언트 설정
│   │
│   ├── entities/                     # TypeORM 엔티티 (DB 테이블)
│   │   ├── user.entity.ts            # 유저 테이블
│   │   ├── post.entity.ts            # 게시글 테이블
│   │   ├── hashtag.entity.ts         # 해시태그 테이블
│   │   ├── post-hashtag.entity.ts    # 게시글-해시태그 매핑 (다대다)
│   │   └── vote.entity.ts            # 투표 테이블
│   │
│   └── modules/                      # 기능별 모듈
│       ├── users/                    # 유저 모듈
│       │   ├── users.module.ts
│       │   ├── users.controller.ts
│       │   ├── users.service.ts
│       │   └── create-user.dto.ts
│       │
│       ├── posts/                    # 게시글 모듈
│       │   ├── posts.module.ts
│       │   ├── posts.controller.ts
│       │   ├── posts.service.ts
│       │   └── create-post.dto.ts
│       │
│       ├── hashtags/                 # 해시태그 모듈
│       │   ├── hashtags.module.ts
│       │   ├── hashtags.controller.ts
│       │   ├── hashtags.service.ts
│       │   └── hashtag-response.dts.ts
│       │
│       └── votes/                    # 투표 모듈
│           ├── votes.module.ts
│           ├── votes.controller.ts
│           ├── votes.service.ts
│           └── create-vote.dto.ts
│
├── test/                             # 테스트 파일
├── .env                              # 환경변수 (gitignore)
├── package.json                      # 의존성
├── tsconfig.json                     # TypeScript 설정
└── nest-cli.json                     # NestJS CLI 설정
```

---

## 기술 스택

| 항목 | 기술 |
|------|------|
| Framework | NestJS 11 |
| ORM | TypeORM 0.3 |
| Database | PostgreSQL (Supabase) |
| Storage | Supabase Storage |
| API 문서 | Swagger (OpenAPI) |
| 언어 | TypeScript 5 |

---

## 데이터베이스 스키마 (ERD)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │    posts    │       │  hashtags   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)     │    ┌──│ id (PK)     │
│ user_name   │  │    │ user_id(FK) │◄───┤  │ name        │
│ display_name│  │    │ value       │    │  └─────────────┘
│ profile_url │  │    │ image_url   │    │
│ profile_img │  │    │ created_at  │    │
│ created_at  │  │    └─────────────┘    │
└─────────────┘  │           │           │
                 │           │           │
                 │    ┌──────┴──────┐    │
                 │    │post_hashtags│    │
                 │    ├─────────────┤    │
                 │    │ id (PK)     │    │
                 │    │ post_id(FK) │────┤
                 │    │ hashtag_id  │────┘
                 │    └─────────────┘
                 │
                 │    ┌─────────────┐
                 │    │   votes     │
                 │    ├─────────────┤
                 │    │ id (PK)     │
                 └───►│ user_id(FK) │
                      │ post_id(FK) │
                      │ is_funny    │
                      │ created_at  │
                      └─────────────┘
```

---

## 엔티티 상세

### User (users)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| user_name | string | 유저네임 (unique) |
| display_name | string | 표시 이름 |
| profile_image_url | string? | 프로필 이미지 URL |
| profile_url | string? | 프로필 페이지 URL |
| created_at | Date | 생성일시 |

### Post (posts)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| user_id | UUID | 작성자 (FK → users) |
| value | text? | 게시글 텍스트 |
| image_url | string | 이미지 URL (Supabase Storage) |
| created_at | Date | 생성일시 |

### Hashtag (hashtags)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| name | string | 해시태그 이름 (unique, 예: #고양이) |

### PostHashtag (post_hashtags)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| post_id | UUID | FK → posts |
| hashtag_id | UUID | FK → hashtags |

### Vote (votes)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| post_id | UUID | FK → posts |
| user_id | UUID | FK → users |
| is_funny | boolean | true: 재밌음, false: 안재밌음 |
| created_at | Date | 투표일시 |

**제약조건:** `(user_id, post_id)` UNIQUE - 유저당 게시글당 1표만 가능

---

## API 엔드포인트

### Health Check
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/` | 서버 상태 확인 |

### Users (`/users`)
| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/users` | 유저 생성 |
| GET | `/users/:id` | 유저 조회 (ID) |
| GET | `/users?username=xxx` | 유저 검색 (username) |
| GET | `/users` | 전체 유저 목록 |

### Posts (`/posts`)
| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/posts` | 게시글 작성 (multipart/form-data) |
| GET | `/posts` | 전체 게시글 목록 |
| GET | `/posts/:id` | 게시글 상세 조회 |

### Hashtags (`/hashtags`)
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/hashtags/trending?limit=10` | 인기 해시태그 목록 (썸네일 포함) |
| GET | `/hashtags/:id?userId=xxx` | 해시태그별 게시글 목록 |

### Votes (`/votes`)
| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/votes` | 투표하기 |
| DELETE | `/votes` | 유저의 모든 투표 삭제 (데모용) |

---

## API 상세

### POST /posts (게시글 작성)

**Request:** `multipart/form-data`
```json
{
  "image": "<파일>",
  "value": "이 밈 너무 웃겨요",
  "user_id": "user-uuid",
  "hashtags": ["#고양이", "#밈"]
}
```

**Response:**
```json
{
  "id": "post-uuid",
  "message": "게시글이 생성되었습니다."
}
```

### GET /hashtags/trending

**Response:**
```json
[
  {
    "id": "hashtag-uuid",
    "name": "#고양이",
    "post_count": 15,
    "thumbnail_images": [
      "https://supabase.../image1.jpg",
      "https://supabase.../image2.jpg",
      "https://supabase.../image3.jpg"
    ]
  }
]
```

### GET /hashtags/:id

**Response:**
```json
[
  {
    "id": "post-uuid",
    "content": "밈 텍스트",
    "image_url": "https://supabase.../image.jpg",
    "created_at": "2025-12-06T00:00:00Z",
    "author": {
      "id": "user-uuid",
      "user_name": "memeLover",
      "display_name": "밈왕",
      "profile_image_url": "https://...",
      "user_profile_url": "https://..."
    },
    "vote_count": {
      "funny": 10,
      "not_funny": 3,
      "total": 13
    }
  }
]
```

### POST /votes (투표하기)

**Request:**
```json
{
  "post_id": "post-uuid",
  "user_id": "user-uuid",
  "is_funny": true
}
```

**Response:**
```json
{
  "id": "vote-uuid",
  "message": "투표가 완료되었습니다"
}
```

---

## 환경변수

```bash
# .env
DATABASE_URL=postgresql://user:password@host:5432/database
SERVER_URL=https://meme-court-be.onrender.com

SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (watch mode)
npm run start:dev

# 빌드
npm run build

# 프로덕션 실행
npm run start:prod

# 린트
npm run lint
```

**서버 URL:**
- 로컬: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

---

## 주요 기능 흐름

### 1. 게시글 작성 흐름
```
클라이언트 → POST /posts (이미지 + 데이터)
         → Supabase Storage에 이미지 업로드
         → posts 테이블에 게시글 저장
         → hashtags 테이블에 해시태그 생성/조회
         → post_hashtags 테이블에 매핑 저장
         → 성공 응답
```

### 2. 피드 조회 흐름
```
클라이언트 → GET /hashtags/trending
         → 게시글 수 기준 인기 해시태그 조회
         → 각 해시태그별 최근 이미지 3개 조회
         → 응답

클라이언트 → GET /hashtags/:id (토픽 클릭)
         → 해당 해시태그의 게시글 목록 조회
         → 투표 수 계산 포함
         → 응답
```

### 3. 투표 흐름
```
클라이언트 → POST /votes
         → 중복 투표 체크
         → votes 테이블에 저장
         → 성공 응답
```
