import axios from 'axios';
import React, { useState } from 'react';
import useDaumPostcode from '../../../../hooks/useDaumPostcode';
import Button from '../../../../components/Button/Button';
import Input from '../../../../components/Input/Input';
import ICONS from '../../../../constants/icons';
import * as S from './FillInfoStep.styled';
import { useOutletContext } from 'react-router-dom';
import { SigninResponseBody } from '../../../../types';
import { SERVER_URL } from '../../../../configs/api';

function FillInfoStep() {
  const { goNextStep } = useOutletContext<{
    stepId: number;
    goNextStep: () => void;
  }>();
  const { postcode, addressData } = useDaumPostcode();
  const [watchingValues, setWatchingValues] = useState({
    email: '',
    password: '',
    'confirm-password': '',
  });

  const [isEmailUnique, setIsEmailUnique] = useState(false);
  const [isConfirmPasswordSame, setIsConfirmPasswordSame] = useState(false);

  const handleChange: React.FormEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { name, value } = target as HTMLInputElement;

    if (name === 'email') setIsEmailUnique(false);

    if (name === 'password') {
      setIsConfirmPasswordSame(
        watchingValues['confirm-password'] === value && value !== ''
      );
    }

    if (name === 'confirm-password') {
      setIsConfirmPasswordSame(
        watchingValues['password'] === value && value !== ''
      );
    }

    setWatchingValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickAddressButton = () => {
    postcode?.open();
  };

  const extractPayloadWithForm = (formElement: HTMLFormElement) => {
    const formData = new FormData(formElement);
    const {
      email,
      password,
      name,
      gender,
      birthday,
      contact,
      address,
      detailAddress,
      zoneCode,
    } = Object.fromEntries(formData.entries());

    return {
      email,
      password,
      profileImageUrl: `http://gravatar.com/avatar/${Date.now()}?d=identicon`,
      name,
      gender,
      birthday,
      contact,
      fullAddress: { address, detailAddress, zoneCode },
      terms: true,
    };
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const payload = extractPayloadWithForm(e.target as HTMLFormElement);

    try {
      if (!isEmailUnique || !isConfirmPasswordSame || !addressData) {
        throw new Error(
          '?????????, ???????????? ??????, ?????? ??? ???????????? ?????? ?????? ????????????.'
        );
      }

      await axios({
        method: 'post',
        url: `${SERVER_URL}/api/customers`,
        data: payload,
      });

      // ????????????
      const response = await axios.post<SigninResponseBody>(
        `${SERVER_URL}/api/customer/authentication/sign-in`,
        {
          email: payload.email,
          password: payload.password,
        }
      );

      const { accessToken, userId } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userId', String(userId));

      goNextStep();
    } catch (e) {
      if (axios.isAxiosError(e)) {
        alert('???????????? ?????? ????????? ???????????????.');
      } else {
        alert(e);
      }
    }
  };

  const handleClickIsEmailDuplicated = async () => {
    const email = watchingValues['email'];

    try {
      await axios({
        method: 'get',
        url: `${SERVER_URL}/api/validation?email=${email}`,
      });

      setIsEmailUnique(true);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        alert('????????? ??????????????????.');
      } else {
        alert(e);
      }
    }
  };

  return (
    <S.Form onSubmit={handleSubmit}>
      <S.FormFieldBox>
        <S.LeftFlexBox>
          <S.Label required>?????????</S.Label>
        </S.LeftFlexBox>
        <S.CenterFlexBox>
          <Input
            type="email"
            name="email"
            placeholder="woowashop@woowahan.com"
            pattern="[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.([a-zA-Z])+"
            required
            onChange={handleChange}
          />
          {isEmailUnique && (
            <S.HintParagraph>?????? ????????? ??????????????????.</S.HintParagraph>
          )}
        </S.CenterFlexBox>
        <S.RightFlexBox>
          <S.Button type="button" onClick={handleClickIsEmailDuplicated}>
            ?????? ??????
          </S.Button>
        </S.RightFlexBox>
      </S.FormFieldBox>

      {/* ------------------------------------ */}
      <S.FormFieldBox>
        <S.LeftFlexBox>
          <S.Label required>????????????</S.Label>
        </S.LeftFlexBox>
        <S.CenterFlexBox>
          <Input
            type="password"
            name="password"
            placeholder="??????????????? ??????????????????."
            minLength={8}
            maxLength={20}
            pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[!@#&()-\[{}\]:;',?/*~$^+=<>]).{8,20}"
            value={watchingValues['password']}
            onChange={handleChange}
            required
          />
        </S.CenterFlexBox>
        <S.RightFlexBox />
      </S.FormFieldBox>
      {/* ------------------------------------ */}
      <S.FormFieldBox>
        <S.LeftFlexBox>
          <S.Label required>???????????? ??????</S.Label>
        </S.LeftFlexBox>
        <S.CenterFlexBox>
          <Input
            type="password"
            name="confirm-password"
            placeholder="??????????????? ?????? ??? ??????????????????."
            minLength={8}
            maxLength={20}
            pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[!@#&()-\[{}\]:;',?/*~$^+=<>]).{8,20}"
            onChange={handleChange}
            required
          />
          {isConfirmPasswordSame && (
            <S.HintParagraph>??????????????? ???????????????.</S.HintParagraph>
          )}
        </S.CenterFlexBox>
        <S.RightFlexBox />
      </S.FormFieldBox>
      {/* ------------------------------------ */}
      <S.FormFieldBox>
        <S.LeftFlexBox>
          <S.Label required>??????</S.Label>
        </S.LeftFlexBox>
        <S.CenterFlexBox>
          <Input
            type="text"
            name="name"
            placeholder="????????? ??????????????????."
            minLength={2}
            maxLength={5}
            onChange={handleChange}
            required
          />
        </S.CenterFlexBox>
        <S.RightFlexBox />
      </S.FormFieldBox>
      {/* ------------------------------------ */}
      <S.FormFieldBox>
        <S.LeftFlexBox>
          <S.Label required>????????????</S.Label>
        </S.LeftFlexBox>
        <S.CenterFlexBox>
          <Input
            type="tel"
            name="contact"
            placeholder="01012345678"
            pattern="[0-9]{8,11}"
            onChange={handleChange}
            required
          />
        </S.CenterFlexBox>
        <S.RightFlexBox>
          <S.Button disabled>???????????? ??????</S.Button>
        </S.RightFlexBox>
      </S.FormFieldBox>
      {/* ------------------------------------ */}
      <S.FormFieldBox>
        <S.LeftFlexBox>
          <S.Label required>??????</S.Label>
        </S.LeftFlexBox>
        <S.CenterFlexBox>
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <Input
              type="text"
              name="zoneCode"
              placeholder="????????????"
              value={addressData?.zonecode}
              readOnly
            />
            <S.Button type="button" onClick={handleClickAddressButton}>
              {ICONS.SEARCH}?????? ??????
            </S.Button>
          </div>
          <Input
            type="text"
            name="address"
            placeholder="??????"
            value={addressData?.address}
            readOnly
          />
          <Input
            type="text"
            name="detailAddress"
            maxLength={20}
            placeholder="?????? ??????"
            disabled={!addressData}
          />
        </S.CenterFlexBox>
        <S.RightFlexBox />
      </S.FormFieldBox>
      {/* ------------------------------------ */}
      <S.FormFieldBox>
        <S.LeftFlexBox>
          <S.Label>??????</S.Label>
        </S.LeftFlexBox>
        <S.CenterFlexBox>
          <S.RadioButtonBox>
            <label>
              <input type="radio" value="male" name="gender" />
              ??????
            </label>
            <label>
              <input type="radio" value="female" name="gender" />
              ??????
            </label>
            <label>
              <input
                type="radio"
                value="undefined"
                name="gender"
                defaultChecked
              />
              ?????? ??????
            </label>
          </S.RadioButtonBox>
        </S.CenterFlexBox>
        <S.RightFlexBox />
      </S.FormFieldBox>
      {/* ------------------------------------ */}
      <S.FormFieldBox>
        <S.LeftFlexBox>
          <S.Label>????????????</S.Label>
        </S.LeftFlexBox>
        <S.CenterFlexBox>
          <Input
            type="date"
            name="birthday"
            min="1900-01-01"
            max="2022-06-01"
          />
        </S.CenterFlexBox>
        <S.RightFlexBox />
      </S.FormFieldBox>
      {/* ------------------------------------ */}
      <S.SubmitButtonBox>
        <Button type="submit">????????????</Button>
      </S.SubmitButtonBox>
    </S.Form>
  );
}

export default FillInfoStep;
