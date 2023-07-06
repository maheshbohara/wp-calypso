import { useI18n } from '@wordpress/react-i18n';
import { useEffect } from 'react';
import { StepContainer } from 'calypso/../packages/onboarding/src';
import FormattedHeader from 'calypso/components/formatted-header';
import { recordTracksEvent } from 'calypso/lib/analytics/tracks';
import { useSelector, useDispatch } from 'calypso/state';
import { getCurrentUserId } from 'calypso/state/current-user/selectors';
import { fetchUserPurchases } from 'calypso/state/purchases/actions';
import { getUserPurchases } from 'calypso/state/purchases/selectors';
import { CompleteDomainsTransferred } from './complete-domains-transferred';
import type { Step } from '../../types';
import './styles.scss';

const Complete: Step = function Complete( { flow } ) {
	const { __, _n } = useI18n();
	const dispatch = useDispatch();

	const userId = useSelector( ( state ) => getCurrentUserId( state ) );
	const userPurchases = useSelector( ( state ) => getUserPurchases( state ) );
	const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

	const newlyTransferredDomains = userPurchases?.filter(
		( purchase ) =>
			purchase.productSlug === 'domain_transfer' &&
			Date.now() - new Date( purchase.subscribedDate ).getTime() < oneDay
	);

	useEffect( () => {
		dispatch( fetchUserPurchases( userId ) );
	}, [] );

	return (
		<>
			{ newlyTransferredDomains && (
				<StepContainer
					flowName={ flow }
					stepName="complete"
					isHorizontalLayout={ false }
					isLargeSkipLayout={ false }
					formattedHeader={
						<FormattedHeader
							id="domains-header"
							headerText={ _n(
								'Congrats on your domain transfer',
								'Congrats on your domain transfers',
								newlyTransferredDomains.length
							) }
							subHeaderText={ __(
								'Hold tight as we complete the set up of your newly transferred domain.'
							) }
							align="center"
							children={
								<a
									href="/domains/manage"
									className="components-button is-primary manage-all-domains"
								>
									{ __( 'Manage all domains' ) }
								</a>
							}
						/>
					}
					stepContent={
						<CompleteDomainsTransferred newlyTransferredDomains={ newlyTransferredDomains } />
					}
					recordTracksEvent={ recordTracksEvent }
					showHeaderJetpackPowered={ false }
					showHeaderWooCommercePowered={ false }
					showVideoPressPowered={ false }
					showJetpackPowered={ false }
					hideBack={ true }
				/>
			) }
		</>
	);
};

export default Complete;