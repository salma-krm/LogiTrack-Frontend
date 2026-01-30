package com.smartusers.logitrackapi.service.interfaces;

import com.smartusers.logitrackapi.entity.Inventory;
import com.smartusers.logitrackapi.entity.Warehouse;

import java.util.List;

public interface InventoryService {
    Inventory create(Inventory inventory);
    Inventory update(Long id, Inventory inventory);
    List<Inventory> getAll();
    Inventory getById(Long id);
    void delete(Long id);
}
