import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { SearchCardsDto, SearchCardsSchema } from './dto/search-cards.dto';

@ApiTags('catalog')
@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // ------------------------------------------------------------
  // Cards
  // ------------------------------------------------------------

  @Get('cards')
  @ApiOperation({ summary: 'Buscar cartas com filtros e paginação' })
  searchCards(@Query(new ZodValidationPipe(SearchCardsSchema)) query: SearchCardsDto) {
    return this.catalogService.searchCards(query);
  }

  @Get('cards/:id')
  @ApiOperation({ summary: 'Detalhe de uma carta específica' })
  getCard(@Param('id') id: string) {
    return this.catalogService.findCardById(id);
  }

  // ------------------------------------------------------------
  // Sets
  // ------------------------------------------------------------

  @Get('sets')
  @ApiOperation({ summary: 'Listar todos os sets' })
  listSets() {
    return this.catalogService.listSets();
  }

  @Get('sets/:id')
  @ApiOperation({ summary: 'Detalhe de um set específico' })
  getSet(@Param('id') id: string) {
    return this.catalogService.findSetById(id);
  }
}
