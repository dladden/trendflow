import React, { useEffect, useState } from 'react';
import {
  FormSelectorIcon,
  UserImgLarge,
  FallbackChart,
  CustomErrorToast,
  FormComponentLogos,
  CustomSuccessToast,
} from '../components';
import Container from '../assets/wrappers/SubmitFormContainer';
import { useOutletContext } from 'react-router-dom';
// import { TREND_CATEGORY, TECHNOLOGIES } from '../utils/constants';
import { Form, useNavigation, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
/**
 *
 * @param {*} param0
 * @returns
 */
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log('Data which is being sent: ', data);
  try {
    await customFetch.post('/trends/submit', data);
    toast.success(
      <CustomSuccessToast message={'Thank You, Trend Was Submitted'} />
    );
    return redirect('/dashboard');
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return error;
  }
};
const AddTrend = () => {
  const { user } = useOutletContext(); //getting the user from DashboardLayout
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [trendCategory, setTrendCategory] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [defaultTrendCategory, setDefaultTrendCategory] = useState(null);
  const [defaultTrendTech, setDefaultTrendTech] = useState(null);
  const [techIconUrl, setTechIconUrl] = useState('');
  const [cateIconUrl, setCateIconUrl] = useState('');

  //fetching the icon data from the node server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customFetch.get('trends/icon-data');
        const { TREND_CATEGORY, TECHNOLOGIES } = response.data;
        setTrendCategory(Object.values(TREND_CATEGORY));
        setTechnologies(Object.values(TECHNOLOGIES));
        const trendCategoryList = Object.values(TREND_CATEGORY);
        const technologiesList = Object.values(TECHNOLOGIES);

        if (trendCategoryList.length > 0) {
          setDefaultTrendCategory(trendCategoryList[0].value);
        }

        if (technologiesList.length > 0) {
          setDefaultTrendTech(technologiesList[0].value);
        }
      } catch (error) {
        console.error('Error fetching trend icon-data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <Container>
      <div className="user-container clearfix">
        <div className="user-info">
          <div className="user-profile">
            <UserImgLarge user_img={user.profile_img} />
          </div>
          <div className="username">
            <h5>{user.username}</h5>
          </div>
        </div>
      </div>
      <div className="submit-container">
        <div>
          <Form method="post" className="form">
            <h4 className="form-title">Submit a Tech:</h4>
            <div className="form-center">
              {/* <LogoCarousel /> */}
              <FormComponentLogos
                type="text"
                name="trend"
                placeholder="Any tech on your mind?"
              />
              {/* <FormComponent type="text" name="Any tech on your mind?" /> */}
              <FormSelectorIcon
                labelText="Choose Category:"
                name="trendCategory"
                defaultValue={defaultTrendCategory}
                list={trendCategory.map((cate) => ({
                  ...cate,
                  value: cate.value,
                  label: cate.label,
                  image: cate.image,
                }))}
                onChange={(name, value) => {
                  setCateIconUrl(value ? value.image : '');
                }}
              />
              <input
                type="hidden"
                id="cateIconUrl"
                name="cateIconUrl"
                value={cateIconUrl || ''}
              />
              <FormSelectorIcon
                labelText="Choose Technology:"
                name="trendTech"
                defaultValue={defaultTrendTech}
                list={technologies.map((tech) => ({
                  ...tech,
                  value: tech.value,
                  label: tech.label,
                  image: tech.image,
                }))}
                onChange={(name, value) => {
                  setTechIconUrl(value ? value.image : '');
                }}
              />
              <input
                type="hidden"
                id="techIconUrl"
                name="techIconUrl"
                value={techIconUrl || ''}
              />
              <button
                type="submit"
                className="btn btn-block form-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'submitting' : 'submit'}
              </button>
            </div>
          </Form>
        </div>
        <div className="chart-container">
          <FallbackChart />
        </div>
      </div>
    </Container>
  );
};

export default AddTrend;
