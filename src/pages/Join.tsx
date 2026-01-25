import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import Logo from '@/pages/Logo.tsx';
import { useForm } from 'react-hook-form';
import { RESPONSE } from '@/constants/api.ts';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '@/hooks/useAlert';
import { ALERT } from '@/constants/message.ts';
import coreApi from '@/lib/api.ts';
import { useEffect, useState } from 'react';
import { USER_REGEX } from '@/constants/regex.ts';
import { RequiredDot } from '@/components/custom/RequiredDot.tsx';
import { Circle, CircleCheck } from 'lucide-react';

type DuplicateStatus = 'NONE' | 'DUPLICATE' | 'UNIQUE';

type JoinFormValue = {
  userId: string;
  userName: string;
  email: string;
  password: string;
};

const initFormValue: JoinFormValue = {
  userId: '',
  userName: '',
  email: '',
  password: '',
};

const setErrorClass = (value: boolean): string => {
  return value ? 'text-destructive' : '';
};

const FieldValidDescription = ({ message }: { message: string }) => {
  return <FieldDescription style={{ textAlign: 'left' }}>{message}</FieldDescription>;
};

const Join = () => {
  const method = useForm({
    defaultValues: initFormValue,
    mode: 'onTouched', // 최초 Blur 시 오류 검증 진행
  });

  const {
    register,
    formState: { touchedFields },
  } = method;

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // 사용자 아이디 검증 관련
  const userIdReg = register('userId');
  const [userIdValid, setUserIdValid] = useState<boolean>(false);
  const [userIdDuplicateValid, setUserIdDuplicateValid] = useState<DuplicateStatus>('NONE');
  const userIdHasError = !!touchedFields.userId && !userIdValid;

  const handleUserIdCheck = async () => {
    if (userIdDuplicateValid === 'UNIQUE') {
      return;
    }

    const userId = method.getValues('userId');
    await coreApi.get(`/auth/available/user_id?userId=${userId}`).then((res) => {
      if (res.data.data) {
        setUserIdDuplicateValid('UNIQUE');
      } else {
        setUserIdDuplicateValid('DUPLICATE');
      }
    });
  };

  // 사용자 이름 검증 관련
  const userNameReg = register('userName');
  const [userNameValid, setUserNameValid] = useState<boolean>(false);
  const userNameHasError = !!touchedFields.userName && !userNameValid;

  // 이메일 검증 관련
  const emailReg = register('email');
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const emailHasError = !!touchedFields.email && !emailValid;

  // 비밀번호 검증 관련
  const passwordReg = register('password');
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
  const passwordHasError = !!touchedFields.password && !passwordValid;

  // 회원가입 가능 여부 관련
  const [joinValid, setJoinValid] = useState<boolean>(false);
  useEffect(() => {
    setJoinValid(
      userIdValid &&
        userNameValid &&
        emailValid &&
        passwordValid &&
        userIdDuplicateValid == 'UNIQUE',
    );
  }, [userIdValid, userNameValid, emailValid, passwordValid, userIdDuplicateValid]);

  const onSubmit = async () => {
    await coreApi
      .post('/auth/join', method.getValues())
      .then((res) => {
        const data = res.data;
        if (data.resultCode === RESPONSE.SUCCESS && data.data === 1) {
          showAlert({
            title: ALERT.TITLE.SUCCESS,
            description: '회원가입에 성공하였습니다.',
            onClose: () => navigate('/login'),
          });
        } else {
          showAlert({
            title: ALERT.TITLE.ERROR,
            description: '회원가입 중 오류가 발생하였습니다.\n' + data.resultMessage,
          });
        }
      })
      .catch((e) => {
        showAlert({
          title: ALERT.TITLE.ERROR,
          description: '회원가입 중 오류가 발생하였습니다.\n' + e.message,
        });
      });
  };

  return (
    <>
      <div className="flex w-full h-screen items-center justify-center">
        <div className="flex w-full flex-col" style={{ width: '500px' }}>
          <Logo />
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">회원가입</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="userId" className={setErrorClass(userIdHasError)}>
                      사용자 아이디
                      <RequiredDot />
                    </FieldLabel>
                    <div
                      className="grid grid-cols-2 gap-2"
                      style={{ gridTemplateColumns: '1fr 120px' }}
                    >
                      <div>
                        <Input
                          id="userId"
                          type="text"
                          {...userIdReg}
                          placeholder="john.doe"
                          maxLength={30}
                          onChange={(e) => {
                            void userIdReg.onChange(e);
                            setUserIdValid(USER_REGEX.USER_ID.test(e.target.value));
                            if (userIdDuplicateValid === 'UNIQUE') {
                              setUserIdDuplicateValid('NONE');
                            }
                          }}
                          onBlur={(e) => userIdReg.onBlur(e)}
                          required
                          aria-invalid={userIdHasError}
                        />
                      </div>
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          style={{ width: '120px' }}
                          disabled={userIdHasError || !userIdValid || !userIdDuplicateValid}
                          className={
                            userIdDuplicateValid === 'UNIQUE'
                              ? 'border-green-600 hover:bg-transparent'
                              : ''
                          }
                          onClick={handleUserIdCheck}
                        >
                          {userIdHasError ||
                          !userIdValid ||
                          !userIdDuplicateValid ||
                          userIdDuplicateValid !== 'UNIQUE' ? (
                            <Circle />
                          ) : (
                            <CircleCheck color={'green'} />
                          )}
                          중복 확인
                        </Button>
                      </div>
                    </div>
                    <FieldValidDescription
                      message={
                        '5자 이상 30자 이하의 문자열로, 영문 대소문자, 숫자, 마침표(.)만 사용할 수 있고, 그 외 문자와 공백은 허용되지 않습니다.'
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="userName" className={setErrorClass(userNameHasError)}>
                      이름
                      <RequiredDot />
                    </FieldLabel>
                    <Input
                      id="userName"
                      type="text"
                      {...userNameReg}
                      placeholder="John Doe"
                      maxLength={30}
                      onChange={(e) => {
                        void userNameReg.onChange(e);
                        setUserNameValid(USER_REGEX.USER_NAME.test(e.target.value));
                      }}
                      onBlur={(e) => userNameReg.onBlur(e)}
                      required
                      aria-invalid={userNameHasError}
                    />
                    <FieldValidDescription
                      message={
                        '영문 대소문자, 숫자, 마침표(.)만 사용할 수 있고, 공백이나 그 외 문자는 사용할 수 없습니다. 길이는 5자 이상, 30자 이하로 입력해주세요.'
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email" className={setErrorClass(emailHasError)}>
                      이메일
                      <RequiredDot />
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      {...emailReg}
                      placeholder="john@example.com"
                      onChange={(e) => {
                        void emailReg.onChange(e);
                        setEmailValid(USER_REGEX.EMAIL.test(e.target.value));
                      }}
                      required
                      aria-invalid={emailHasError}
                    />
                    <FieldValidDescription message={'이메일 형식에 맞게 입력해주세요.'} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password" className={setErrorClass(passwordHasError)}>
                      비밀번호
                      <RequiredDot />
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      {...passwordReg}
                      onChange={(e) => {
                        void passwordReg.onChange(e);
                        setPasswordValid(USER_REGEX.PASSWORD.test(e.target.value));
                      }}
                      required
                      aria-invalid={passwordHasError}
                    />
                    <FieldValidDescription
                      message={
                        '영문 대소문자, 숫자를 반드시 포함해야 하며, 특수문자는 !@.만 사용할 수 있습니다. 길이는 5자 이상, 30자 이하로 입력해주세요.'
                      }
                    />
                  </Field>
                  <Field>
                    <Button type="button" onClick={onSubmit} disabled={!joinValid}>
                      회원가입
                    </Button>
                    <FieldDescription className="text-center">
                      이미 회원가입을 하셨나요? <a href="/login">로그인</a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Join;
