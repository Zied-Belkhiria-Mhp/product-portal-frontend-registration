import { Row } from 'react-bootstrap'
import { getCompanyDetails } from '../helpers/utils'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import SearchInput from 'react-search-input'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { FooterButton } from './footerButton'
import { connect } from 'react-redux'
import { IState } from '../types/store/redux.store.types'
import { addCurrentStep, addCompanyData } from '../actions/user.action'
import { withRouter } from 'react-router-dom'
import { Dispatch } from 'redux'
import { DataErrorCodes } from '../helpers/DataError'
import { toast } from 'react-toastify'
import { CompanyDetailsData } from '../data/companyDetails'

interface CompanyDataProps {
  currentActiveStep: number
  addCurrentStep: (step: number) => void
  addCompanyData: (companydata: CompanyDetailsData) => void
}

export const CompanyDataCax = ({
  currentActiveStep,
  addCurrentStep,
  addCompanyData,
}: CompanyDataProps) => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [bpn, setBpn] = useState('')
  const [bpnErrorMsg, setBpnErrorMessage] = useState('')
  const [legalEntity, setLegalEntity] = useState('')
  const [registeredName, setRegisteredName] = useState('')
  const [streetHouseNumber, setStreetHouseNumber] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')

  const fetchData = async (expr: string) => {
    const companyDetails = await getCompanyDetails(expr)
    setBpn(companyDetails?.[0]?.bpn)
    setLegalEntity(companyDetails?.[0]?.names?.[0]?.value)
    setRegisteredName(companyDetails?.[0]?.names?.[0]?.value)
    setStreetHouseNumber(
      companyDetails?.[0]?.addresses?.[0]?.thoroughfares[0]?.value
    )
    setPostalCode(companyDetails?.[0]?.addresses?.[0]?.postCodes[0]?.value)
    setCity(companyDetails?.[0]?.addresses?.[0]?.localities[0]?.value)
    setCountry(companyDetails?.[0]?.addresses?.[0]?.country?.name)
  }

  const onSearchChange = (expr: string) => {
    const bpnPattern = /^BPNL[a-z0-9]{12}$/i
    if (bpnPattern.test(expr.trim())) {
      fetchData(expr)
      // make sure to catch any error
      .catch((errorCode: number) => {
        setBpnErrorMessage(t('registrationStepOne.bpnNotExistError'))
        const message = DataErrorCodes.includes(errorCode)
          ? t(`ErrorMessage.${errorCode}`)
          : t(`ErrorMessage.default`)
        //   alert(message)

        toast.error(message)
        //  history.push("/finish");
      })
      setBpnErrorMessage('')
    } else {
      setBpnErrorMessage(t('registrationStepOne.bpnInvalidError'))
    }
  }

  const backClick = () => {
    addCurrentStep(currentActiveStep - 1)
  }

  const nextClick = () => {
    addCurrentStep(currentActiveStep + 1)
    const companydata = {
      bpn: bpn,
      legalEntity: legalEntity,
      registrationName: registeredName,
      address: streetHouseNumber,
      postalCode: postalCode,
      city: city,
      country: country,
    }
    addCompanyData(companydata)
  }

  return (
    <>
      <div className="mx-auto col-9 container-registration">
        <div className="head-section">
          <div className="mx-auto step-highlight d-flex align-items-center justify-content-center">
            1
          </div>
          <h4 className="mx-auto d-flex align-items-center justify-content-center">
            {t('registrationStepOne.verifyCompayDataHeading')}
          </h4>
          <div className="mx-auto text-center col-9">
            {t('registrationStepOne.verifyCompayDataSubHeading')}
          </div>
        </div>
        <div className="companydata-form">
          <Row className="mx-auto col-9">
            <div className={`form-search ${bpnErrorMsg ? 'error' : ''}`}>
              <label> {t('registrationStepOne.seachDatabase')}</label>
              <SearchInput
                className="search-input"
                value={search}
                onChange={(expr) => onSearchChange(expr)}
              />
              <label>{bpnErrorMsg}</label>
            </div>
          </Row>
          <Row className="col-9 mx-auto">
            <div className="section-divider">
              <span className="text-center">
                {t('registrationStepOne.enterManualText')}
              </span>
            </div>
          </Row>
          <Row className="mx-auto col-9">
            <div className="form-data">
              <label>
                {' '}
                {t('registrationStepOne.bpn')}{' '}
                <AiOutlineQuestionCircle
                  color="#939393"
                  data-tip="hello world"
                />
              </label>
              <input type="text" value={bpn} />
              <div className="company-hint">
                {t('registrationStepOne.helperText')}
              </div>
            </div>
          </Row>
          <Row className="mx-auto col-9">
            <div className="form-data">
              <label>
                {' '}
                {t('registrationStepOne.legalEntity')}{' '}
                <AiOutlineQuestionCircle
                  color="#939393"
                  data-tip="hello world"
                />{' '}
              </label>
              <input
                type="text"
                value={legalEntity}
                onChange={(e) => setLegalEntity(e.target.value)}
              />
              <div className="company-hint">
                {t('registrationStepOne.helperText')}
              </div>
            </div>
          </Row>
          <Row className="mx-auto col-9">
            <div className="form-data">
              <label>
                {' '}
                {t('registrationStepOne.registeredName')}{' '}
                <AiOutlineQuestionCircle
                  color="#939393"
                  data-tip="hello world"
                />
              </label>
              <input
                type="text"
                value={registeredName}
                onChange={(e) => setRegisteredName(e.target.value)}
              />
              <div className="company-hint">
                {t('registrationStepOne.helperText')}
              </div>
            </div>
          </Row>

          <Row className="mx-auto col-9">
            <span className="form-heading">
              {t('registrationStepOne.organizationAdd')}
            </span>
          </Row>

          <Row className="mx-auto col-9">
            <div className="form-data">
              <label> {t('registrationStepOne.streetHouseNumber')} </label>
              <input
                type="text"
                value={streetHouseNumber}
                onChange={(e) => setStreetHouseNumber(e.target.value)}
              />
            </div>
          </Row>

          <Row className="mx-auto col-9">
            <div className="col-4 form-data">
              <label> {t('registrationStepOne.postalCode')} </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>

            <div className="col-8 form-data">
              <label>{t('registrationStepOne.city')}</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </Row>

          <Row className="mx-auto col-9">
            <div className="form-data">
              <label>{t('registrationStepOne.country')}</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </Row>
        </div>
      </div>
      <FooterButton
        labelBack={t('button.back')}
        labelNext={t('button.confirm')}
        handleBackClick={() => backClick()}
        handleNextClick={() => nextClick()}
      />
    </>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addCurrentStep: (step: number) => {
    dispatch(addCurrentStep(step))
  },
  addCompanyData: (companyData: CompanyDetailsData) => {
    dispatch(addCompanyData(companyData))
  },
})

export default withRouter(
  connect(
    (state: IState) => ({
      currentActiveStep: state.user.currentStep,
    }),
    mapDispatchToProps
  )(CompanyDataCax)
)
