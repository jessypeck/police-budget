import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { Link } from "react-router-dom";
import { Chart } from 'Chart';
import { AlternativeDropdown, CityDropdown } from 'Dropdowns';
import { City, Alternative, getUnitCost, getDeptBudget, getDeptName } from 'Types';
import cities from 'cities.json';
import alternatives from 'alternatives.json';

const sortedCities = cities.sort((a, b) => (a.name > b.name) ? 1 : -1);
const sortedAlternatives = alternatives.sort((a, b) => (a.name > b.name) ? 1 : -1);

declare var woopra: any; // recognize the "woopra" global

// -------------------------------------------------------- //
//                       Main Component                     //
// -------------------------------------------------------- //

export const Generator = () => {
  const [city, setCity] = useState<City>(getRandomCity());
  const [alternative, setAlternative] = useState<Alternative>(getRandomAlt());

  // Track "page" view on first load
  useEffect(() => {
    woopra.track('view page', {
      title: 'generator'
    })
  }, [])

  const setCityData = (newCity: City) => {
    setCity(newCity);
    woopra.track('set city', {
      cityName: newCity.name,
      alternative: alternative.name
    })
  }

  const setAlternativeData = (newAlt: Alternative) => {
    setAlternative(newAlt);
    woopra.track('set alternative', {
      altName: newAlt.name,
      city: city.name
    })
  }

  return (
    <PageWrapper>
      <HeadlineWrapper>
        With 50% of the <CityDropdown
                          city={city}
                          allCities={sortedCities}
                          setCity={setCityData}
                         /><br/>
        <HeadlinePolice> police budget</HeadlinePolice>, we could pay for
      </HeadlineWrapper>
      <AlternativeNumber>{getDisplayAmount(city, alternative)}</AlternativeNumber>
      <AlternativeDropdown
        currAlt={alternative}
        allAlternatives={sortedAlternatives}
        setAlternative={setAlternativeData}
      />
      <CenteredText>
        Instead, city spending looks like this:
      </CenteredText>
      <BudgetComparison city={city} alternative={alternative} />
      <Chart
        policePercent={findPercent(city.policeBudget, city.generalFund)}
        altPercent={findPercent(getDeptBudget(alternative, city.name, cities), city.generalFund)}
      />
      <DefundMessage>Tell {city.name} to <strong>#defundthepolice</strong>.</DefundMessage>
      <DataLinkWrapper>
        <DataLink to='/data'>View Data & Sources</DataLink>
      </DataLinkWrapper>
    </PageWrapper>
  )
}



// -------------------------------------------------------- //
//                        Sub-Components                    //
// -------------------------------------------------------- //

interface BudgetComparisonProps {
  city: City,
  alternative: Alternative
}


const BudgetComparison = ({city, alternative}: BudgetComparisonProps) => (
  <BudgetComparisonWrapper>
    <BudgetSection
      name='Police'
      budget={city.policeBudget}
      generalFund={city.generalFund}
      type='police'
    />
    <BudgetSection
      name={getDeptName(alternative, city.name)}
      budget={getDeptBudget(alternative, city.name, cities)}
      generalFund={city.generalFund}
      type='alt'
    />
  </BudgetComparisonWrapper>
)

interface BudgetSectionProps {
  name: string,
  budget: number,
  generalFund: number,
  type: string
}

const BudgetSection = ({name, budget, generalFund, type}: BudgetSectionProps) => (
  <BudgetSectionStyle type={type}>
    <BudgetPercent>{displayPercent(budget, generalFund)}%</BudgetPercent>
    <BudgetLabel>&nbsp;{name}</BudgetLabel>
    <BoldText>{budget ? `$${numToWord(budget)}` : 'No $ from General Funds'}</BoldText>
  </BudgetSectionStyle>
)


// -------------------------------------------------------- //
//                           Helpers                        //
// -------------------------------------------------------- //

const getRandomCity = (): City => cities[Math.floor(Math.random()*cities.length)];
const getRandomAlt = (): Alternative => alternatives[Math.floor(Math.random()*alternatives.length)];

const findPercent = (smallNum: number, bigNum: number): number => {
  const decimal = (smallNum / bigNum);
  const percent = Math.round(decimal * 100);
  return percent;
}

const displayPercent = (smallNum: number, bigNum: number): string => {
  const percent = findPercent(smallNum, bigNum);
  if (percent === 0) {
    return "< 1"
  }
  else {
    return percent.toString()
  }
}

const getStartingDigits = (number: number, numToRemove: number): string => {
  const numString = number.toString();
  return numString.substring(0, numString.length - numToRemove);
}

const numToWord = (number: number): string => {
  const length = Math.ceil(Math.log10(number + 1));
  if (length > 9) {
    // For #s in the billions, show first two digits with a decimal
    let digits = getStartingDigits(number, 8);
    digits = digits.split('').join('.');
    return `${digits} billion`;
  }
  else if (length > 6) {
    const digits = getStartingDigits(number, 6);
    return `${digits} million`;
  }
  else if (length > 3) {
    const digits = getStartingDigits(number, 3);
    return `${digits} thousand`;
  }
  else {
    return number.toString();
  }
}

const getDisplayAmount = (city: City, alternative: Alternative): string => {
  const halfBudget = city.policeBudget / 2;
  const unitCost = getUnitCost(alternative, city.name);
  const amount = halfBudget / unitCost;
  const roundedAmount = Math.round(amount);
  const amountWithCommas = roundedAmount.toLocaleString()
  return amountWithCommas;
}

// -------------------------------------------------------- //
//                           Styles                         //
// -------------------------------------------------------- //

const PageWrapper = styled.div`
  padding: 30px;
  padding-top: 40px;
  margin: auto;
  max-width: 360px;
`

const HeadlineWrapper = styled.div`
  font-size: 18px;
  text-align: center;
  margin-bottom: 10px;
  font-weight: 600;
  line-height: 1.5;
`

const HeadlinePolice = styled.span`
  color: red;
  font-weight: 600;
`

const AlternativeNumber = styled.div`
  text-align: center;
  color: yellow;
  font-size: 38px;
  font-weight: 800;
`


const BudgetComparisonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`

const CenteredText = styled.div`
  text-align: center;
`

const BoldText = styled.div`
  font-size: 14px;
`

const BudgetLabel = styled.span`
  font-size: 15px;
  font-weight: 600;
`

const BudgetPercent = styled.span`
  font-size: 20px;
  font-weight: 600;
`

interface BudgetSectionStyleProps {
  type: string
}

const BudgetSectionStyle = styled.div<BudgetSectionStyleProps>`
  font-size: 14px;
  ${props => props.type === 'police' && css`
    text-align: left;
    color: red;
  `}
  ${props => props.type === 'alt' && css`
    text-align: right;
    color: yellow;
  `}
`

const DefundMessage = styled.div`
  margin-top: 30px;
  text-align: center;
`
const DataLinkWrapper = styled.div`
  margin-top: 10px;
  text-align: center;
`

const DataLink = styled(Link)`
  color: #BBB;
  text-decoration: none;
  font-size: 14px;
`
