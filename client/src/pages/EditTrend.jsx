import React, { useEffect, useState } from 'react';
import {
  SEOProtected,
  FormSelector,
  DangerousHTML,
  FallbackChart,
  FormComponent,
  CustomErrorToast,
  FormComponentLock,
  CustomSuccessToast,
  ScrollSpyComponent,
  ContentBoxHighlighted,
} from '../components';
import { MdEdit } from 'react-icons/md';
import { IoLockClosed } from 'react-icons/io5';
import { useUser } from '../context/UserContext'; // importing UserContext
import { useOutletContext } from 'react-router-dom';
import { useDashboardContext } from './DashboardLayout';
import Container from '../assets/wrappers/EditTrendContainer';
import { PiHashDuotone, PiEyeLight, PiTrendUp } from 'react-icons/pi';
import { PiFileSvgFill } from 'react-icons/pi';
// import Container from '../assets/wrappers/TrendPageContainer';
import { TREND_CATEGORY, TECHNOLOGIES } from '../../../utils/constants'; //this is a problem, need to fetch this instead of importing
import { EDIT_PAGE_USE, EDIT_PAGE_POST } from '../utils/constants.js';
import { Form, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
/**
 * Edit Page is only accessible to admin user to edit certain felids of the trend and POST them
 * @returns
 *
 */
//Fetching the trend data
export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get('/users/current-user'); // Fetch current user
    if (!data.user || data.user.role !== 'admin') {
      toast.error(
        <CustomErrorToast message="Unauthorized access to this Resource!" />
      );
      return redirect('/dashboard');
    }
    const trendResponse = await customFetch.get(`/trends/edit/${params.slug}`);
    return { user: data.user, trendObject: trendResponse.data.trendObject };
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return redirect('/dashboard');
  }
};
//action for editing the trend
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.patch(`/trends/edit/${params.slug}`, data);
    toast.success(<CustomSuccessToast message={'Trend Edited'} />);
    return redirect('/dashboard');
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return error;
  }
};

const EditTrend = () => {
  const { trendObject } = useLoaderData();
  const navigate = useNavigate();
  const navigation = useLoaderData();
  const isSubmitting = navigation.state === 'submitting';
  const [svgFile, setSvgFile] = useState(null);
  const [svgUrl, setSvgUrl] = useState(trendObject.svg_url || '');

  useEffect(() => {
    const fetchSVG = async () => {
      try {
        const response = await customFetch.get(
          `/trends/get-trend-svg/${trendObject.slug}`
        );
        setSvgUrl(response.data.svg_url);
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };

    fetchSVG();
  }, [trendObject.slug]);

  const handleSVGUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await customFetch.patch(
        `/trends/upload-trend-svg/${trendObject.slug}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('SVG uploaded successfully');
    } catch (error) {
      toast.error('SVG upload failed');
    }
  };

  const handleSVGChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSvgFile(file);
      handleSVGUpload(file);
    }
  };

  const handleDelete = async () => {
    try {
      await customFetch.delete(`/trends/edit/${trendObject.slug}`);
      toast.success(<CustomSuccessToast message={'Trend Deleted'} />);
      navigate('/dashboard'); // Redirect after deletion
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    }
  };

  return (
    <Container>
      <SEOProtected />
      <div id="Edit"></div>
      <div className="trend-page-container">
        <div className="page-layout">
          <div className="trend">
            <Form method="post" className="">
              <div className="form-center">
                <div className="edit-trend-content">
                  <div className="edit-trend">
                    <MdEdit className="trend-edit-icon" />
                    <div className="add-svg">
                      <label htmlFor="svgFile" className="svg-upload-label">
                        {svgUrl ? (
                          <div className="svg-display">
                            <img
                              src={svgUrl}
                              alt="Uploaded SVG"
                              className="uploaded-svg"
                            />
                            <PiFileSvgFill className="svg-upload-icon overlay-icon" />
                          </div>
                        ) : (
                          <PiFileSvgFill className="svg-upload-icon" />
                        )}
                        <input
                          type="file"
                          id="svgFile"
                          accept=".svg"
                          onChange={handleSVGChange}
                          className="svg-upload-input"
                        />
                      </label>
                    </div>
                    {trendObject.isApproved ? (
                      <>
                        <FormComponentLock
                          type="text"
                          defaultValue={trendObject.trend}
                        />
                      </>
                    ) : (
                      <>
                        <MdEdit className="trend-edit-icon" />
                        <FormComponent
                          type="text"
                          defaultValue={trendObject.trend}
                        />
                      </>
                    )}
                  </div>
                  <div className="dummy-chart-controls">
                    <div className="date-selector">
                      <div className="circle"></div>
                      {new Date().getFullYear() - 1}
                      <div className="circle"></div>
                      {new Date().getFullYear()}
                      <div className="circle"></div>
                      <div>
                        <p>Forecast</p>
                      </div>
                      <FormSelector
                        name="timePeriod"
                        defaultValue="Select"
                        list={['Daily', 'Weekly', 'Monthly']}
                      />
                    </div>
                  </div>
                </div>
                <FallbackChart />
                <div className="content">
                  <div className="content-selectors">
                    <div className="selector">
                      {trendObject.isApproved ? (
                        <div className="select-locked-input-container">
                          <IoLockClosed className="select-lock-icon" />
                          <div className="locked-input">
                            <p>{trendObject.trendCategory}</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <MdEdit className="edit-icon" />
                          <FormSelector
                            className="form-selector"
                            name="trendCategory"
                            defaultValue={trendObject.trendCategory}
                            list={Object.values(TREND_CATEGORY)}
                          />
                        </>
                      )}
                    </div>
                    <div className="selector">
                      {trendObject.isApproved ? (
                        <div className="select-locked-input-container">
                          <IoLockClosed className="select-lock-icon" />
                          <div className="locked-input">
                            <p>{trendObject.trendTech}</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <MdEdit className="edit-icon" />
                          <FormSelector
                            className="form-selector"
                            name="trendTech"
                            defaultValue={trendObject.trendTech}
                            list={Object.values(TECHNOLOGIES)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div id="Submit"></div>
                  <div className="form-actions">
                    <div className="submit-btn">
                      <button
                        type="submit"
                        className="btn btn-block from-btn"
                        disabled={isSubmitting}
                        style={{ marginLeft: 'auto' }} // Ensure button is glued to the right
                      >
                        {isSubmitting ? 'submitting...' : 'submit'}
                      </button>
                    </div>
                  </div>
                  <div className="trend-use-container">
                    <ContentBoxHighlighted trendUse={EDIT_PAGE_USE} />
                  </div>
                  <div className="trend-blog-post">
                    <DangerousHTML html={EDIT_PAGE_POST} />
                  </div>
                  <div id="Delete"></div>
                </div>
                <div className="form-actions">
                  <div className="delete-btn">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="btn info-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
          <aside className="scroll-spy-sidebar-aside">
            <div className="scroll-spy-sidebar">
              <ScrollSpyComponent sectionIds={['Edit', 'Submit', 'Delete']} />
              <div></div>
            </div>
          </aside>
        </div>
      </div>
    </Container>
  );
};

export default EditTrend;
