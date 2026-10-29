export type Semester = {
  id: string;
  userId: string;
  name: string;
  startsOn: string | null;
  endsOn: string | null;
  timezone: string;
};

export type Course = {
  id: string;
  userId: string;
  semesterId: string;
  code: string;
  title: string;
  instructor: string | null;
  section: string | null;
};
