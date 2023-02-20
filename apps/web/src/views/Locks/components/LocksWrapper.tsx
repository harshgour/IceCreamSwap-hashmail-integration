import { AtomBox } from '@pancakeswap/ui'
import { ArrowBackIcon, Flex, Heading, IconButton, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { AppBody } from 'components/App'
import { useRouter } from 'next/router'
import { PropsWithChildren } from 'react'
import Page from 'views/Page'
import { StyledLockBody, StyledLockContainer } from '../styles'

interface LocksWrapperProps extends PropsWithChildren {
  title: React.ReactNode
  subtitle: React.ReactNode
  hasBackButton?: boolean
  backlink?: string
}

const LocksWrapper: React.FC<LocksWrapperProps> = (props) => {
  const { title, subtitle, children, hasBackButton } = props
  const router = useRouter()

  return (
    <Page>
      <Flex marginBottom="4em" width="100%" height="100%" justifyContent="center">
        <Flex flexDirection="column">
          <StyledLockContainer>
            <AppBody>
              <AtomBox width="full" display="flex" gap="2" padding="24px" borderBottom="1">
                {hasBackButton && (
                  <IconButton
                    onClick={() => {
                      if (props.backlink) router.push(props.backlink)
                      router.back()
                    }}
                    aria-label="Back"
                    variant="text"
                    scale="sm"
                  >
                    <ArrowBackIcon width="32px" />
                  </IconButton>
                )}
                <Flex width={hasBackButton ? undefined : '100%'} flexDirection="column">
                  <AtomBox
                    display="flex"
                    width="full"
                    alignItems={hasBackButton ? undefined : 'center'}
                    justifyContent={hasBackButton ? undefined : 'center'}
                  >
                    <Heading as="h2">{title}</Heading>
                  </AtomBox>
                  <Text color="textSubtle" fontSize="14px" textAlign={hasBackButton ? undefined : 'center'}>
                    {subtitle}
                  </Text>
                </Flex>
              </AtomBox>
              <StyledLockBody>{children}</StyledLockBody>
            </AppBody>
          </StyledLockContainer>
        </Flex>
      </Flex>
    </Page>
  )
}

export default LocksWrapper
