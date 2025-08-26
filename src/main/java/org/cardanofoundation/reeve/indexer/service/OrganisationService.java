package org.cardanofoundation.reeve.indexer.service;

import java.util.Optional;
import org.cardanofoundation.reeve.indexer.model.entity.OrganisationEntity;
import org.cardanofoundation.reeve.indexer.model.repository.OrganisationRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrganisationService {

    private final OrganisationRepository organisationRepository;

    public Optional<OrganisationEntity> findById(String organisationId) {
        return organisationRepository.findById(organisationId);
    }
}
