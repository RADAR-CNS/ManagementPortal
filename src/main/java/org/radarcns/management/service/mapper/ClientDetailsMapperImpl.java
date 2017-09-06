package org.radarcns.management.service.mapper;

import org.radarcns.management.service.dto.ClientDetailsDTO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.provider.ClientDetails;
import org.springframework.security.oauth2.provider.client.BaseClientDetails;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Created by dverbeec on 7/09/2017.
 */
@Component
public class ClientDetailsMapperImpl implements ClientDetailsMapper {
    @Override
    public ClientDetailsDTO clientDetailsToClientDetailsDTO(ClientDetails details) {
        ClientDetailsDTO result = new ClientDetailsDTO();
        result.setClientId(details.getClientId());
        result.setScope(Collections.unmodifiableSet(details.getScope()));
        result.setResourceIds(Collections.unmodifiableSet(details.getResourceIds()));
        result.setAuthorizedGrantTypes(Collections.unmodifiableSet(details.getAuthorizedGrantTypes()));
        result.setAccessTokenValidity(details.getAccessTokenValiditySeconds().longValue());
        result.setRefreshTokenValidity(details.getRefreshTokenValiditySeconds().longValue());
        Set<String> authorities = details.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toSet());
        result.setAuthorities(Collections.unmodifiableSet(authorities));
        return result;
    }

    @Override
    public ClientDetails clientDetailsDTOToClientDetails(ClientDetailsDTO detailsDTO) {
        BaseClientDetails result = new BaseClientDetails();
        result.setClientId(detailsDTO.getClientId());
        result.setClientSecret(detailsDTO.getClientSecret());
        result.setScope(Collections.unmodifiableSet(detailsDTO.getScope()));
        result.setResourceIds(Collections.unmodifiableSet(detailsDTO.getResourceIds()));
        result.setAuthorizedGrantTypes(Collections.unmodifiableSet(detailsDTO.getAuthorizedGrantTypes()));
        result.setAccessTokenValiditySeconds(detailsDTO.getAccessTokenValidity().intValue());
        result.setRefreshTokenValiditySeconds(detailsDTO.getRefreshTokenValidity().intValue());
        Set<GrantedAuthority> authorities = detailsDTO.getAuthorities().stream()
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toSet());
        result.setAuthorities(Collections.unmodifiableSet(authorities));
        if (detailsDTO.getAutoApprove()) {
            result.setAutoApproveScopes(Collections.unmodifiableSet(detailsDTO.getScope()));
        }
        return result;
    }

    @Override
    public List<ClientDetailsDTO> clientDetailsToClientDetailsDTO(List<ClientDetails> detailsList) {
        return detailsList.stream().map(this::clientDetailsToClientDetailsDTO)
            .collect(Collectors.toList());
    }

    @Override
    public List<ClientDetails> clientDetailsDTOToClientDetails(List<ClientDetailsDTO> detailsDTOList) {
        return detailsDTOList.stream().map(this::clientDetailsDTOToClientDetails)
            .collect(Collectors.toList());
    }
}
