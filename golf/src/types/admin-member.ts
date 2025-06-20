export interface Member {
  mId: string;
  prefix: string;
  name: string;
  addr1: string;
  addr2: string;
  addr3: string;
  city: string;
  pin: string;
  state: string;
  type: string;
  dob: string;
  doj: string;
  handicap: number;
  pho: string;
  phr: string;
  phm: string;
  sex: 'M' | 'F';
  ctcode: string;
  ccode: string;
  club: string;
  memberof: string;
  centre: string;
  fax: string;
  email: string;
  selflag: boolean;
  dos: string;
  updt: boolean;
  createdAt: string;
  isDeleted: boolean;
}

export interface CreateMemberRequest {
  prefix: string;
  name: string;
  addr1: string;
  addr2: string;
  addr3: string;
  city: string;
  pin: string;
  state: string;
  type: string;
  dob: string;
  doj: string;
  handicap: number;
  pho: string;
  phr: string;
  phm: string;
  sex: string;
  ctcode: string;
  ccode: string;
  club: string;
  memberof: string;
  centre: string;
  fax: string;
  email: string;
  selflag: boolean;
  dos: string;
  updt: boolean;
}

export interface UpdateMemberRequest extends CreateMemberRequest {}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}