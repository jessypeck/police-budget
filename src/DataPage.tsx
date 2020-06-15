import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { City, Alternative, DataLink } from 'Types';
import cities from 'cities.json';
import alternatives from 'alternatives.json';

// -------------------------------------------------------- //
//                          Helpers                         //
// -------------------------------------------------------- //

const otherData = alternatives.filter(a => !a.salary);

// -------------------------------------------------------- //
//                       Main Component                     //
// -------------------------------------------------------- //


export const DataPage = () => (
  <PageWrapper>
    <CitySection />
    <OtherDataSection />
  </PageWrapper>
)

// -------------------------------------------------------- //
//                       Sub-Components                     //
// -------------------------------------------------------- //

interface CollapsibleSectionProps {
  title: string,
  children: React.ReactNode,
  subSection: boolean
}

const CollapsibleSection = ({ title, children, subSection }: CollapsibleSectionProps) => {
  const [showChildren, setShowChildren] = useState<boolean>(false);

  const toggleShowChildren = () => {
    setShowChildren(!showChildren);
  }

  return (
    <React.Fragment>
      {subSection
        ?
        <CollapsibleSubHeader onClick={() => toggleShowChildren()}>
          { title } <Arrow open={showChildren} subSection={subSection} />
        </CollapsibleSubHeader>
        :
        <CollapsibleHeader onClick={() => toggleShowChildren()}>
          { title } <Arrow open={showChildren} subSection={subSection} />
        </CollapsibleHeader>
      }
      { showChildren && children }
    </React.Fragment>
  )
}


// -------------------------------------------------------- //
//                    City Budget Components                //
// -------------------------------------------------------- //

const CitySection = () => (
  <CollapsibleSection title='City Budgets' subSection={false}>
    {cities.map(city => <CityData city={city} />)}
  </CollapsibleSection>
)

interface CityDataProps {
  city: City
}

const CityData = ({city}: CityDataProps) => (
  <CollapsibleSection title={city.name} subSection={true}>
    <DataSectionWrapper>
      <h4>Links</h4>
      <div>{city.links.map(link => <LinkDisplay link={link} />)}</div>
      <h4>Notes</h4>
      <div>{city.notes.map(note => <Paragraph>{note}</Paragraph>)}</div>
    </DataSectionWrapper>
  </CollapsibleSection>
)

interface LinkDisplayProps {
  link: DataLink
}

const LinkDisplay = ({link}: LinkDisplayProps) => (
  <a href={link.url} target='_blank' rel="noopener noreferrer">{link.linkText}</a>
)

// -------------------------------------------------------- //
//                     Other Data Components                //
// -------------------------------------------------------- //

const OtherDataSection = () => (
  <CollapsibleSection title='Other Data' subSection={false}>
    {otherData.map(alt => <AlternativeData alternative={alt} />)}
  </CollapsibleSection>
)

interface AnternativeDataProps {
  alternative: Alternative
}

const AlternativeData = ({alternative}: AnternativeDataProps) => (
  <CollapsibleSection title={alternative.name} subSection={true}>
    {
      alternative.links &&
      <DataSectionWrapper>
        <h4>Links</h4>
        <div>{alternative.links.map(link => <LinkDisplay link={link} />)}</div>
      </DataSectionWrapper>
    }
    {
      alternative.notes &&
      <DataSectionWrapper>
        <h4>Notes</h4>
        <div>{alternative.notes.map(note => <Paragraph>{note}</Paragraph>)}</div>
      </DataSectionWrapper>
    }
  </CollapsibleSection>
)

// -------------------------------------------------------- //
//                           Styles                         //
// -------------------------------------------------------- //

const PageWrapper = styled.div`
  padding: 40px 30px;
  margin: auto;
  max-width: 500px;
`

const DataSectionWrapper = styled.div`
  margin-left: 15px;
`

const Paragraph = styled.p`
  color: #EEE;
  font-size: 14px;
`

interface ArrowProps {
  open: boolean;
  subSection: boolean;
}

const Arrow = styled.span<ArrowProps>`
  border: solid white;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: ${props => props.open ? `rotate(45deg)` : `rotate(-45deg)`};
  color: white;
  margin-bottom: 3px;
  ${props => props.subSection && css`
    border-color: yellow;
    color: yellow;
  `}
`

const CollapsibleHeader = styled.h2`
  padding-bottom: 5px;
  border-bottom: 2px solid #555;
  &:hover{
    opacity: 0.8;
    cursor: pointer;
  }
`

const CollapsibleSubHeader = styled.h3`
  color: yellow;
  &:hover{
    opacity: 0.8;
    cursor: pointer;
  }
`