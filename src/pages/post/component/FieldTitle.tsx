import { FieldDescription, FieldLabel } from '@/components/ui/field.tsx';
import { RequiredDot } from '@/components/custom/RequiredDot.tsx';

interface Props {
  id: string;
  title: string;
  desc: string;
  required: boolean;
}

/**
 * 입력 필드 타이틀
 *
 * @param props
 * @param props.id htmlFor 에 이용될 아이디
 * @param props.title 타이틀 텍스트
 * @param props.desc 설명 텍스트
 * @param props.required 필수값 표시 (RequiredDot 컴포넌트 이용)
 * @constructor
 */
export const FieldTitle = (props: Props) => {
  return (
    <>
      <FieldLabel htmlFor={props.id}>
        {props.title}
        {props.required && <RequiredDot />}
      </FieldLabel>
      <FieldDescription style={{ textAlign: 'left' }}>{props.desc}</FieldDescription>
    </>
  );
};
