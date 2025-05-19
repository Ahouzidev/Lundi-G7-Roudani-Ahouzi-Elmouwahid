package com.example.backend.service;

import com.example.backend.entity.Zone;
import com.example.backend.repository.ZoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ZoneService {
    
    @Autowired
    private ZoneRepository zoneRepository;

    public List<Zone> getAllZones() {
        return zoneRepository.findAll();
    }

    public Optional<Zone> getZoneById(Long id) {
        return zoneRepository.findById(id);
    }

    public Zone createZone(Zone zone) {
        return zoneRepository.save(zone);
    }

    public Zone updateZone(Long id, Zone zoneDetails) {
        Zone zone = zoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zone non trouvée avec l'id: " + id));
        
        zone.setNom(zoneDetails.getNom());
        zone.setDescription(zoneDetails.getDescription());
        zone.setLocalisation(zoneDetails.getLocalisation());
        
        return zoneRepository.save(zone);
    }

    public void deleteZone(Long id) {
        Zone zone = zoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zone non trouvée avec l'id: " + id));
        zoneRepository.delete(zone);
    }
} 