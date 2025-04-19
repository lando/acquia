---
description: Helpful guides and tutorials for using the Lando Acquia plugin.
layout: page
title: Acquia Plugin Guides
sidebar: false
---

<script setup>
import {VPLCollectionPage, VPLCollectionPageTitle, VPLCollectionItems} from '@lando/vitepress-theme-default-plus';
import {useCollection} from '@lando/vitepress-theme-default-plus';

const {prev, pages} = useCollection('guide');

</script>

<VPLCollectionPage>
  <VPLCollectionPageTitle>
    <template #title>
      Acquia Plugin Guides
    </template>
    <template #lead>
      Tutorials and step-by-step instructions for common tasks with the Lando Acquia plugin.
    </template>
  </VPLCollectionPageTitle>
  <VPLCollectionItems :items="pages"/>
</VPLCollectionPage>
