import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CollectionService } from './collection.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { ApiZodBody, ZodBody } from '../../common/decorators/zod-body.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AddToCollectionDto, AddUserCardSchema } from './dto/add-to-collection.dto';
import { UpdateCollectionItemDto, UpdateUserCardSchema } from './dto/update-collection-item.dto';
import { ListCollectionDto, ListCollectionSchema } from './dto/list-collection.dto';

@ApiTags('collection')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adicionar carta à coleção' })
  @ApiZodBody(AddUserCardSchema)
  add(
    @CurrentUser() user: CurrentUserPayload,
    @ZodBody(AddUserCardSchema) dto: AddToCollectionDto,
  ) {
    return this.collectionService.add(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cartas da coleção com filtros' })
  list(
    @CurrentUser() user: CurrentUserPayload,
    @Query(new ZodValidationPipe(ListCollectionSchema)) query: ListCollectionDto,
  ) {
    return this.collectionService.list(user.userId, query);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Resumo agregado da coleção (valor, ROI, contagem)' })
  summary(@CurrentUser() user: CurrentUserPayload) {
    return this.collectionService.summary(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe de um item da coleção' })
  findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.collectionService.findOne(user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar item da coleção' })
  @ApiZodBody(UpdateUserCardSchema)
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @ZodBody(UpdateUserCardSchema) dto: UpdateCollectionItemDto,
  ) {
    return this.collectionService.update(user.userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover item da coleção' })
  async remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    await this.collectionService.remove(user.userId, id);
  }
}
